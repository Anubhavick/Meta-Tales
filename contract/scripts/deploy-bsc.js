const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying to BSC Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "BNB");
  
  if (balance == 0n) {
    console.log("❌ Insufficient balance! Get BNB from: https://testnet.binance.org/faucet-smart");
    return;
  }

  const MetaTalesNFT = await hre.ethers.getContractFactory("MetaTalesNFT");
  const metaTalesNFT = await MetaTalesNFT.deploy();
  
  await metaTalesNFT.waitForDeployment();
  
  console.log("✅ MetaTalesNFT deployed to:", await metaTalesNFT.getAddress());
  console.log("🔗 Transaction hash:", metaTalesNFT.deploymentTransaction().hash);
  console.log("🌐 View on BscScan: https://testnet.bscscan.com/tx/" + metaTalesNFT.deploymentTransaction().hash);
  
  console.log("\n📝 Update your .env file with:");
  console.log(`BSC_TESTNET_CONTRACT_ADDRESS=${await metaTalesNFT.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });