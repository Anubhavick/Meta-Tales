const { IPFSUploader } = require('./utils/ipfs-uploader');
require('dotenv').config();

/**
 * Demo script for IPFS upload functionality
 * This script demonstrates how to upload literary works to IPFS
 */

async function demo() {
  // Check if API key is provided
  const apiKey = process.env.NFT_STORAGE_API_KEY;
  if (!apiKey) {
    console.log(' Please set NFT_STORAGE_API_KEY in your .env file');
    console.log('Get your free API key from: https://nft.storage/');
    console.log('Add this line to your .env file:');
    console.log('NFT_STORAGE_API_KEY=your_api_key_here');
    return;
  }

  try {
    const uploader = new IPFSUploader(apiKey);

    // Sample literary works for demonstration
    const sampleStory = {
      title: "The Digital Muse",
      author: "Alex Wordsmith",
      content: `In the year 2025, writers discovered that their words could become more than just text on a page. Through blockchain technology, stories became living entities, owned and cherished by readers across the globe.

Maya, a young poet, was among the first to mint her verses as NFTs. Each poem carried with it not just the words, but the soul of its creation - the late nights, the inspiration, the tears and joy that went into every line.

"My words are no longer just mine," she realized as readers from different continents began collecting her work. "They belong to those who truly understand their value."

The marketplace wasn't just about buying and selling; it was about preserving the essence of human creativity in the digital age. Every story, every poem, every comic strip became a piece of immortal art, protected by the immutable nature of the blockchain.

As Maya watched her first story find its way to a collector in Tokyo, she smiled. The future of literature had arrived, and it was more beautiful than she had ever imagined.`,
      description: "A short science fiction story about the future of digital literature and NFTs",
      category: "story",
      genre: "science fiction",
      attributes: [
        { trait_type: "Reading Time", value: "5 minutes" },
        { trait_type: "Mood", value: "Inspirational" },
        { trait_type: "Setting", value: "Future" }
      ]
    };

    const samplePoem = {
      title: "Verses in the Void",
      author: "Luna Nightquill",
      content: `In pixels and light, my thoughts take flight,
Through networks vast and servers bright.
Each word a star in digital space,
Forever held in blockchain's embrace.

No paper yellows, no ink shall fade,
My verses in eternity are made.
From heart to heart, from soul to soul,
The poet's truth, the reader's goal.

In this new world of ones and zeros,
We are all digital heroes.
Creating, sharing, loving, learning,
The wheel of culture ever turning.`,
      description: "A poem celebrating the intersection of poetry and technology",
      category: "poem",
      genre: "contemporary",
      attributes: [
        { trait_type: "Style", value: "Free Verse" },
        { trait_type: "Theme", value: "Technology" },
        { trait_type: "Lines", value: "12" }
      ]
    };

    console.log('🚀 Starting IPFS upload demo...\n');

    // Upload the story
    console.log('📖 Uploading story...');
    const storyResult = await uploader.uploadLiteraryWork(sampleStory);
    console.log('\n' + '='.repeat(50) + '\n');

    // Upload the poem
    console.log('📝 Uploading poem...');
    const poemResult = await uploader.uploadLiteraryWork(samplePoem);
    console.log('\n' + '='.repeat(50) + '\n');

    // Summary
    console.log('📊 UPLOAD SUMMARY');
    console.log('Story Metadata URI:', storyResult.metadataURI);
    console.log('Poem Metadata URI:', poemResult.metadataURI);
    console.log('\n🎯 Ready for minting! Use these metadata URIs with your NFT contract.');

    // Test metadata retrieval
    console.log('\n🔍 Testing metadata retrieval...');
    const storyCID = storyResult.metadataURI.replace('ipfs://', '');
    const retrievedMetadata = await uploader.retrieveContent(storyCID);
    console.log('Retrieved metadata preview:', retrievedMetadata.substring(0, 200) + '...');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo
if (require.main === module) {
  demo().catch(console.error);
}

module.exports = { demo };