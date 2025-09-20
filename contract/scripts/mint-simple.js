const { ethers } = require("hardhat");

async function main() {
  console.log("Minting a test NFT...");
  
  // Get the contract
  const MetaTalesNFT = await ethers.getContractFactory("MetaTalesNFT");
  const contract = MetaTalesNFT.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Minting to:", deployer.address);
  
  // Create simple metadata
  const metadata = {
    name: "Test Literary NFT",
    description: "A test NFT for the Meta-Tales marketplace",
    image: "https://via.placeholder.com/400x400.png?text=Test+NFT",
    attributes: [
      {
        trait_type: "Genre",
        value: "Test"
      },
      {
        trait_type: "Rarity",
        value: "Common"
      }
    ]
  };
  
  // For testing, we'll use a simple data URI
  const metadataJson = JSON.stringify(metadata);
  const metadataURI = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;
  
  // Mint the NFT
  try {
    const tx = await contract.mintNFT(
      deployer.address,
      metadataURI,
      deployer.address,
      250 // 2.5% royalty
    );
    
    console.log("Transaction submitted:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ NFT minted successfully!");
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    // Get the token ID from the Transfer event
    const transferEvent = receipt.logs.find(log => 
      log.topics[0] === ethers.id("Transfer(address,address,uint256)")
    );
    
    if (transferEvent) {
      const tokenId = parseInt(transferEvent.topics[3], 16);
      console.log("Token ID:", tokenId);
      console.log("Owner:", deployer.address);
      console.log("Metadata URI:", metadataURI.substring(0, 100) + "...");
    }
    
  } catch (error) {
    console.error("❌ Error minting NFT:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });