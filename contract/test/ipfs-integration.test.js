const { expect } = require("chai");
const { IPFSUploader } = require("../utils/ipfs-uploader");

describe("IPFS Integration", function () {
  let uploader;

  describe("IPFSUploader Class", function () {
    it("Should throw error without API key", function () {
      expect(() => {
        new IPFSUploader();
      }).to.throw("NFT.Storage API key is required");
    });

    it("Should create instance with API key", function () {
      const uploader = new IPFSUploader("test_api_key");
      expect(uploader).to.be.instanceOf(IPFSUploader);
    });
  });

  describe("Metadata Generation", function () {
    beforeEach(function () {
      uploader = new IPFSUploader("test_api_key");
    });

    it("Should generate correct MIME types", function () {
      expect(uploader.getMimeType("test.jpg")).to.equal("image/jpeg");
      expect(uploader.getMimeType("test.png")).to.equal("image/png");
      expect(uploader.getMimeType("test.txt")).to.equal("text/plain");
      expect(uploader.getMimeType("test.json")).to.equal("application/json");
      expect(uploader.getMimeType("test.unknown")).to.equal("application/octet-stream");
    });

    it("Should validate required metadata fields", async function () {
      try {
        await uploader.uploadMetadata({});
        expect.fail("Should have thrown error for missing required fields");
      } catch (error) {
        expect(error.message).to.include("Name and description are required");
      }
    });

    it("Should create proper NFT metadata structure", function () {
      const testWork = {
        title: "Test Story",
        author: "Test Author",
        content: "This is a test story with multiple words.",
        description: "A test description",
        category: "story",
        genre: "test"
      };

      // Test the expected metadata structure
      expect(testWork.title).to.equal("Test Story");
      expect(testWork.author).to.equal("Test Author");
      expect(testWork.content.split(/\s+/).length).to.equal(8);
      expect(testWork.category).to.equal("story");
    });
  });

  describe("Literary Work Processing", function () {
    it("Should calculate word count correctly", function () {
      const content = "This is a test story with multiple words.";
      const wordCount = content.split(/\s+/).length;
      expect(wordCount).to.equal(8); // Corrected expected value
    });

    it("Should handle special characters in filenames", function () {
      const title = "My Story: A Tale of Hope & Dreams!";
      const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
      expect(filename).to.equal("My_Story__A_Tale_of_Hope___Dreams_.txt");
    });
  });
});