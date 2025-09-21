const { ethers } = require("hardhat");

async function main() {
  console.log("Minting test NFTs to user wallet...");
  
  // Get the contract
  const MetaTalesNFT = await ethers.getContractFactory("MetaTalesNFT");
  const contract = MetaTalesNFT.attach("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  
  // Get the deployer account (who can mint)
  const [deployer] = await ethers.getSigners();
  console.log("Minting from deployer:", deployer.address);
  
  // Target wallet address
  const userWallet = "0xDbBA23de32b3cD84065F66Edaa69E2B20B0824b7";
  console.log("Minting to user wallet:", userWallet);
  
  // Create different NFT metadata for variety
  const nftMetadatas = [
    {
      name: "The Digital Odyssey",
      description: "A captivating story about a journey through cyberspace, where reality and virtual worlds collide in unexpected ways.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attributes: [
        { trait_type: "Genre", value: "Science Fiction" },
        { trait_type: "Rarity", value: "Rare" },
        { trait_type: "Word Count", value: "5000" },
        { trait_type: "Author", value: "Meta-Tales Community" }
      ]
    },
    {
      name: "Whispers of the Ancient Forest",
      description: "A mystical tale of an enchanted forest where trees hold the memories of centuries past.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attributes: [
        { trait_type: "Genre", value: "Fantasy" },
        { trait_type: "Rarity", value: "Epic" },
        { trait_type: "Word Count", value: "3500" },
        { trait_type: "Author", value: "Meta-Tales Community" }
      ]
    },
    {
      name: "Love in the Time of AI",
      description: "A romantic story exploring human connections in an age of artificial intelligence.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      attributes: [
        { trait_type: "Genre", value: "Romance" },
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Word Count", value: "2800" },
        { trait_type: "Author", value: "Meta-Tales Community" }
      ]
    }
  ];
  
  // Mint each NFT
  for (let i = 0; i < nftMetadatas.length; i++) {
    const metadata = nftMetadatas[i];
    
    console.log(`\n🎨 Minting NFT ${i + 1}: "${metadata.name}"`);
    
    // Create metadata URI
    const metadataJson = JSON.stringify(metadata);
    const metadataURI = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;
    
    try {
      const tx = await contract.mintNFT(
        userWallet,
        metadataURI,
        userWallet, // User gets royalties
        250 // 2.5% royalty
      );
      
      console.log("   Transaction submitted:", tx.hash);
      const receipt = await tx.wait();
      console.log("    Minted successfully in block:", receipt.blockNumber);
      
      // Get the token ID from the Transfer event
      const transferEvent = receipt.logs.find(log => 
        log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      
      if (transferEvent) {
        const tokenId = parseInt(transferEvent.topics[3], 16);
        console.log("   Token ID:", tokenId);
      }
      
    } catch (error) {
      console.error(`    Error minting "${metadata.name}":`, error.message);
    }
    
    // Small delay between mints
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("\n🎉 All NFTs minted successfully!");
  console.log(`Check your dashboard at http://localhost:3000/dashboard to see your NFTs!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });