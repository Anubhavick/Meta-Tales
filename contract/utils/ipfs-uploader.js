const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');

/**
 * IPFS Upload Utility for Meta-Tales
 * This utility helps upload literary works and metadata to IPFS via nft.storage
 */

class IPFSUploader {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('NFT.Storage API key is required');
    }
    this.client = new NFTStorage({ token: apiKey });
  }

  /**
   * Upload a text file (story, poem, etc.) to IPFS
   * @param {string} content - The text content
   * @param {string} filename - The filename
   * @returns {Promise<string>} IPFS CID
   */
  async uploadText(content, filename) {
    try {
      const file = new File([content], filename, { type: 'text/plain' });
      const cid = await this.client.storeBlob(file);
      console.log(`✅ Text uploaded to IPFS: ${cid}`);
      return cid;
    } catch (error) {
      console.error('❌ Error uploading text:', error);
      throw error;
    }
  }

  /**
   * Upload an image file to IPFS
   * @param {string} filePath - Path to the image file
   * @returns {Promise<string>} IPFS CID
   */
  async uploadImage(filePath) {
    try {
      const fileData = fs.readFileSync(filePath);
      const filename = path.basename(filePath);
      const mimeType = this.getMimeType(filename);
      
      const file = new File([fileData], filename, { type: mimeType });
      const cid = await this.client.storeBlob(file);
      console.log(`✅ Image uploaded to IPFS: ${cid}`);
      return cid;
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Create and upload NFT metadata to IPFS
   * @param {Object} metadata - NFT metadata object
   * @returns {Promise<string>} Metadata IPFS URI
   */
  async uploadMetadata(metadata) {
    try {
      // Validate required metadata fields
      if (!metadata.name || !metadata.description) {
        throw new Error('Name and description are required for NFT metadata');
      }

      // Create standard NFT metadata format
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image || '',
        external_url: metadata.external_url || '',
        attributes: metadata.attributes || [],
        properties: {
          category: metadata.category || 'literary',
          type: metadata.type || 'text',
          word_count: metadata.word_count || 0,
          language: metadata.language || 'en',
          genre: metadata.genre || 'general',
          author: metadata.author || '',
          created_at: metadata.created_at || new Date().toISOString(),
          ...metadata.properties
        }
      };

      const metadataFile = new File(
        [JSON.stringify(nftMetadata, null, 2)], 
        'metadata.json', 
        { type: 'application/json' }
      );

      const cid = await this.client.storeBlob(metadataFile);
      const uri = `ipfs://${cid}`;
      
      console.log(`✅ Metadata uploaded to IPFS: ${uri}`);
      return uri;
    } catch (error) {
      console.error('❌ Error uploading metadata:', error);
      throw error;
    }
  }

  /**
   * Upload a complete literary work with content and metadata
   * @param {Object} literaryWork - Complete work data
   * @returns {Promise<Object>} Upload results with CIDs and metadata URI
   */
  async uploadLiteraryWork(literaryWork) {
    try {
      const {
        title,
        author,
        content,
        description,
        category, // 'story', 'poem', 'comic', 'novel'
        genre,
        coverImage,
        attributes = []
      } = literaryWork;

      console.log(`📚 Uploading literary work: "${title}" by ${author}`);

      // Upload the main content
      const contentFilename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      const contentCID = await this.uploadText(content, contentFilename);

      // Upload cover image if provided
      let imageCID = '';
      if (coverImage) {
        if (typeof coverImage === 'string' && fs.existsSync(coverImage)) {
          imageCID = await this.uploadImage(coverImage);
        }
      }

      // Create comprehensive metadata
      const metadata = {
        name: title,
        description: description,
        image: imageCID ? `ipfs://${imageCID}` : '',
        external_url: '',
        attributes: [
          { trait_type: 'Author', value: author },
          { trait_type: 'Category', value: category },
          { trait_type: 'Genre', value: genre },
          { trait_type: 'Word Count', value: content.length },
          ...attributes
        ],
        properties: {
          category: 'literary',
          type: category,
          word_count: content.split(/\s+/).length,
          language: 'en',
          genre: genre,
          author: author,
          content_cid: contentCID,
          created_at: new Date().toISOString()
        }
      };

      // Upload metadata
      const metadataURI = await this.uploadMetadata(metadata);

      const result = {
        title,
        author,
        contentCID,
        imageCID,
        metadataURI,
        metadata
      };

      console.log('🎉 Literary work uploaded successfully!');
      console.log('Content CID:', contentCID);
      console.log('Image CID:', imageCID || 'None');
      console.log('Metadata URI:', metadataURI);

      return result;
    } catch (error) {
      console.error('❌ Error uploading literary work:', error);
      throw error;
    }
  }

  /**
   * Get MIME type from filename
   * @param {string} filename 
   * @returns {string} MIME type
   */
  getMimeType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.txt': 'text/plain',
      '.json': 'application/json'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Retrieve content from IPFS
   * @param {string} cid - IPFS CID
   * @returns {Promise<string>} Content as text
   */
  async retrieveContent(cid) {
    try {
      const response = await fetch(`https://nftstorage.link/ipfs/${cid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('❌ Error retrieving content:', error);
      throw error;
    }
  }
}

module.exports = { IPFSUploader };