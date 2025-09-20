const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying to Goerli Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");
  
  if (balance.eq(0)) {
    console.log("❌ Insufficient balance! Get Goerli ETH from: https://goerlifaucet.com/");
    return;
  }

  const MetaTalesNFT = await hre.ethers.getContractFactory("MetaTalesNFT");
  const metaTalesNFT = await MetaTalesNFT.deploy();
  
  await metaTalesNFT.deployed();
  
  console.log("✅ MetaTalesNFT deployed to:", metaTalesNFT.address);
  console.log("🔗 Transaction hash:", metaTalesNFT.deployTransaction.hash);
  console.log("🌐 View on Etherscan: https://goerli.etherscan.io/tx/" + metaTalesNFT.deployTransaction.hash);
  
  console.log("\n📝 Update your .env file with:");
  console.log(`GOERLI_CONTRACT_ADDRESS=${metaTalesNFT.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });