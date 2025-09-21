const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying to Polygon Amoy Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "POL");
  
  if (balance === 0n) {
    console.log("⚠️ Insufficient balance! Get Amoy POL from: https://faucet.polygon.technology/");
    return;
  }

  console.log("📝 Compiling contracts...");
  const MetaTalesNFT = await hre.ethers.getContractFactory("MetaTalesNFT");
  
  console.log("🔄 Deploying MetaTalesNFT contract...");
  const metaTalesNFT = await MetaTalesNFT.deploy();
  
  await metaTalesNFT.waitForDeployment();
  const contractAddress = await metaTalesNFT.getAddress();
  
  console.log("✅ MetaTalesNFT deployed to:", contractAddress);
  console.log("📋 Transaction hash:", metaTalesNFT.deploymentTransaction().hash);
  console.log("🔍 View on PolygonScan: https://amoy.polygonscan.com/tx/" + metaTalesNFT.deploymentTransaction().hash);
  
  console.log("\n📝 Contract Details:");
  console.log(`Network: Polygon Amoy Testnet (Chain ID: 80002)`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Deployer: ${deployer.address}`);
  
  console.log("\n🔧 Update your .env file with:");
  console.log(`AMOY_CONTRACT_ADDRESS=${contractAddress}`);
  
  console.log("\n🎯 Next steps:");
  console.log("1. Save the contract address in your .env file");
  console.log("2. Verify the contract on PolygonScan (optional)");
  console.log("3. Test minting NFTs on Amoy testnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });