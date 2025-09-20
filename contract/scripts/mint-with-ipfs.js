const { ethers } = require("hardhat");
const { IPFSUploader } = require('../utils/ipfs-uploader');
require('dotenv').config();

/**
 * Complete NFT minting script with IPFS upload
 * This script demonstrates the full flow: upload to IPFS → mint NFT
 */

async function mintLiteraryNFT() {
  // Check if API key is provided
  const apiKey = process.env.NFT_STORAGE_API_KEY;
  if (!apiKey) {
    console.log('❌ Please set NFT_STORAGE_API_KEY in your .env file');
    return;
  }

  try {
    console.log('🚀 Starting complete NFT minting flow...\n');

    // Get contract instance (assumes contract is deployed)
    const MetaTalesNFT = await ethers.getContractFactory("MetaTalesNFT");
    
    // For demo purposes, we'll deploy a new contract
    // In production, you'd use an existing deployed contract
    const [deployer, recipient] = await ethers.getSigners();
    
    console.log('📋 Deploying contract for demo...');
    const contract = await MetaTalesNFT.deploy(
      "Meta-Tales Literary NFTs",
      "MTALES",
      deployer.address, // royalty recipient
      250, // 2.5% royalty
      deployer.address // owner
    );
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log('✅ Contract deployed at:', contractAddress);

    // Initialize IPFS uploader
    const uploader = new IPFSUploader(apiKey);

    // Sample literary work
    const literaryWork = {
      title: "The Blockchain Chronicles",
      author: "Satoshi Writer",
      content: `Chapter 1: The Genesis Block

In the beginning, there was chaos. Information scattered across countless servers, owned by powerful corporations, controlled by centralized authorities. But then came the vision of a decentralized world.

The first block was mined not just in code, but in the imagination of a writer who saw beyond the digital divide. Each word in this story is a transaction, each paragraph a block, each chapter a confirmed addition to the eternal ledger of human creativity.

This is not just a story; it is a proof of concept. It proves that art, literature, and human expression can live forever on the blockchain, owned by those who truly value it, supported by smart contracts that ensure fair compensation for creators.

As you read these words, you become part of the network. You validate the transaction of creativity from writer to reader. You participate in the consensus that this story has value.

Welcome to the future of literature. Welcome to the blockchain chronicles.`,
      description: "The first story in the Meta-Tales universe, exploring the intersection of blockchain technology and creative writing",
      category: "story",
      genre: "science fiction",
      attributes: [
        { trait_type: "Series", value: "Blockchain Chronicles" },
        { trait_type: "Chapter", value: "1" },
        { trait_type: "Reading Time", value: "3 minutes" },
        { trait_type: "First Edition", value: "true" }
      ]
    };

    // Step 1: Upload to IPFS
    console.log('\n📡 Uploading to IPFS...');
    const uploadResult = await uploader.uploadLiteraryWork(literaryWork);

    // Step 2: Mint NFT with metadata URI
    console.log('\n🔨 Minting NFT...');
    const mintTx = await contract.mintNFTWithDefaultRoyalty(
      recipient.address,
      uploadResult.metadataURI
    );
    
    const receipt = await mintTx.wait();
    
    // Get token ID from events
    const transferEvent = receipt.logs.find(log => 
      log.fragment && log.fragment.name === 'Transfer'
    );
    const tokenId = transferEvent.args[2];

    console.log('✅ NFT minted successfully!');
    console.log('Token ID:', tokenId.toString());
    console.log('Owner:', await contract.ownerOf(tokenId));
    console.log('Token URI:', await contract.tokenURI(tokenId));
    
    // Get royalty info
    const [royaltyRecipient, royaltyAmount] = await contract.royaltyInfo(
      tokenId, 
      ethers.parseEther("1") // 1 ETH sale price
    );
    
    console.log('\n💰 Royalty Info:');
    console.log('Recipient:', royaltyRecipient);
    console.log('Amount for 1 ETH sale:', ethers.formatEther(royaltyAmount), 'ETH');

    console.log('\n🎉 Complete flow successful!');
    console.log('Story → IPFS → NFT → Blockchain');
    console.log('The literary work is now permanently preserved and owned as an NFT.');

    return {
      contractAddress,
      tokenId: tokenId.toString(),
      metadataURI: uploadResult.metadataURI,
      owner: recipient.address
    };

  } catch (error) {
    console.error('❌ Minting failed:', error);
    throw error;
  }
}

// Run the minting flow
if (require.main === module) {
  mintLiteraryNFT()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { mintLiteraryNFT };