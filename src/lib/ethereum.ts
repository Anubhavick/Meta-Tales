import { ethers } from 'ethers'

// Contract ABI - simplified for demo
export const META_TALES_NFT_ABI = [
  "function mintNFT(address to, string memory tokenURI, uint256 royaltyPercentage) public returns (uint256)",
  "function totalSupply() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function getCreator(uint256 tokenId) public view returns (address)",
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)",
  "event TokenMinted(uint256 indexed tokenId, address indexed creator, string tokenURI, uint256 royaltyPercentage)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
]

// Demo contract address - would be deployed to testnet/mainnet
export const CONTRACT_ADDRESS = "0x..." // This would be set after deployment

export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
    blockExplorer: 'https://etherscan.io'
  },
  polygon: {
    id: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com'
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    blockExplorer: 'https://sepolia.etherscan.io'
  }
}

export async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum)
  }
  return null
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = await getProvider()
  if (provider) {
    return await provider.getSigner()
  }
  return null
}

export async function getContract(): Promise<ethers.Contract | null> {
  const signer = await getSigner()
  if (signer && CONTRACT_ADDRESS) {
    return new ethers.Contract(CONTRACT_ADDRESS, META_TALES_NFT_ABI, signer)
  }
  return null
}

export function formatEther(value: string | bigint): string {
  return ethers.formatEther(value)
}

export function parseEther(value: string): bigint {
  return ethers.parseEther(value)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export async function waitForTransaction(hash: string) {
  const provider = await getProvider()
  if (provider) {
    return await provider.waitForTransaction(hash)
  }
  return null
}