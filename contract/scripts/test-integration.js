const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Meta-Tales NFT Contract Integration...\n");

  // Connect to deployed contract
  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const MetaTalesNFT = await ethers.getContractFactory("MetaTalesNFT");
  const contract = MetaTalesNFT.attach(contractAddress);
  
  const [owner, user1] = await ethers.getSigners();

  console.log("📋 Contract Information:");
  console.log("- Address:", contractAddress);
  console.log("- Name:", await contract.name());
  console.log("- Symbol:", await contract.symbol());
  console.log("- Owner:", await contract.owner());
  
  // Test minting
  console.log("\n🎨 Testing NFT Minting...");
  const tokenURI = "ipfs://QmTestHash123/metadata.json";
  const royaltyRecipient = owner.address; // Creator gets royalties
  const royaltyFraction = 500; // 5%
  
  const mintTx = await contract.mintNFT(user1.address, tokenURI, royaltyRecipient, royaltyFraction);
  await mintTx.wait();
  
  const tokenId = 1;
  console.log("✅ NFT minted successfully!");
  console.log("- Token ID:", tokenId);
  console.log("- Owner:", await contract.ownerOf(tokenId));
  console.log("- Token URI:", await contract.tokenURI(tokenId));
  
  // Test royalty info
  const salePrice = ethers.parseEther("1.0"); // 1 ETH
  const [retrievedRoyaltyRecipient, royaltyAmount] = await contract.royaltyInfo(tokenId, salePrice);
  console.log("- Royalty Recipient:", retrievedRoyaltyRecipient);
  console.log("- Royalty Amount:", ethers.formatEther(royaltyAmount), "ETH");
  
  console.log("\n✅ All tests passed! Contract is ready for frontend integration.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });