// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract MetaTalesNFT is ERC721, ERC721URIStorage, Ownable, IERC2981 {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Royalty info
    struct RoyaltyInfo {
        address recipient;
        uint256 percentage; // Basis points (e.g., 250 = 2.5%)
    }
    
    // Token ID to royalty info
    mapping(uint256 => RoyaltyInfo) private _royalties;
    
    // Token ID to creator
    mapping(uint256 => address) private _creators;
    
    // Platform fee (basis points)
    uint256 public platformFee = 250; // 2.5%
    address public platformFeeRecipient;
    
    // Events
    event TokenMinted(
        uint256 indexed tokenId, 
        address indexed creator, 
        string tokenURI,
        uint256 royaltyPercentage
    );
    
    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 amount
    );
    
    constructor(address _platformFeeRecipient) ERC721("Meta Tales NFT", "MTN") {
        platformFeeRecipient = _platformFeeRecipient;
    }
    
    function mintNFT(
        address to,
        string memory tokenURI,
        uint256 royaltyPercentage
    ) public returns (uint256) {
        require(royaltyPercentage <= 1000, "Royalty cannot exceed 10%");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set creator and royalty info
        _creators[tokenId] = to;
        _royalties[tokenId] = RoyaltyInfo(to, royaltyPercentage);
        
        emit TokenMinted(tokenId, to, tokenURI, royaltyPercentage);
        
        return tokenId;
    }
    
    function getCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _creators[tokenId];
    }
    
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Token does not exist");
        
        RoyaltyInfo memory royalty = _royalties[tokenId];
        uint256 amount = (salePrice * royalty.percentage) / 10000;
        
        return (royalty.recipient, amount);
    }
    
    function updateRoyaltyRecipient(uint256 tokenId, address newRecipient) external {
        require(_exists(tokenId), "Token does not exist");
        require(_creators[tokenId] == msg.sender, "Only creator can update royalty recipient");
        
        _royalties[tokenId].recipient = newRecipient;
    }
    
    function setPlatformFee(uint256 _platformFee) external onlyOwner {
        require(_platformFee <= 1000, "Platform fee cannot exceed 10%");
        platformFee = _platformFee;
    }
    
    function setPlatformFeeRecipient(address _platformFeeRecipient) external onlyOwner {
        platformFeeRecipient = _platformFeeRecipient;
    }
    
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete _creators[tokenId];
        delete _royalties[tokenId];
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, IERC165)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }
}