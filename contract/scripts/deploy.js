const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const MetaTalesNFT = await ethers.getContractFactory("MetaTalesNFT");

  // Get deployer account
  const [deployer] = await ethers.getSigners();

  // Deploy parameters
  const name = "Meta-Tales Literary NFTs";
  const symbol = "MTALES";
  const defaultRoyaltyRecipient = deployer.address; // Use deployer address as default royalty recipient
  const defaultRoyaltyFraction = 250; // 2.5% in basis points
  const owner = deployer.address; // Contract owner

  console.log("Deploying Meta-Tales NFT contract...");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Default Royalty Recipient:", defaultRoyaltyRecipient);
  console.log("Default Royalty Fraction:", defaultRoyaltyFraction / 100, "%");
  console.log("Owner:", owner);
  console.log("Deployer:", deployer.address);

  // Deploy the contract
  const metaTalesNFT = await MetaTalesNFT.deploy(
    name,
    symbol,
    defaultRoyaltyRecipient,
    defaultRoyaltyFraction,
    owner
  );

  await metaTalesNFT.waitForDeployment();

  console.log("\n Meta-Tales NFT contract deployed successfully!");
  console.log("Contract address:", await metaTalesNFT.getAddress());
  console.log("Transaction hash:", metaTalesNFT.deploymentTransaction().hash);

  // Verify deployment
  console.log("\n Contract Details:");
  console.log("- Name:", await metaTalesNFT.name());
  console.log("- Symbol:", await metaTalesNFT.symbol());
  console.log("- Owner:", await metaTalesNFT.owner());
  
  const [defaultRecipient, defaultFraction] = await metaTalesNFT.getDefaultRoyalty();
  console.log("- Default Royalty Recipient:", defaultRecipient);
  console.log("- Default Royalty Percentage:", Number(defaultFraction) / 100, "%");

  console.log("\n🔗 Useful commands:");
  console.log(`npx hardhat verify --network ${network.name} ${await metaTalesNFT.getAddress()} "${name}" "${symbol}" "${defaultRoyaltyRecipient}" ${defaultRoyaltyFraction} "${owner}"`);

  return metaTalesNFT;
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(" Deployment failed:");
    console.error(error);
    process.exit(1);
  });