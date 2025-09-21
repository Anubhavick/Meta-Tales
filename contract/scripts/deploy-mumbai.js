const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying to Mumbai Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "MATIC");
  
  if (balance.eq(0)) {
    console.log(" Insufficient balance! Get Mumbai MATIC from: https://faucet.polygon.technology/");
    return;
  }

  const MetaTalesNFT = await hre.ethers.getContractFactory("MetaTalesNFT");
  const metaTalesNFT = await MetaTalesNFT.deploy();
  
  await metaTalesNFT.deployed();
  
  console.log("MetaTalesNFT deployed to:", metaTalesNFT.address);
  console.log("Transaction hash:", metaTalesNFT.deployTransaction.hash);
  console.log("View on PolygonScan: https://mumbai.polygonscan.com/tx/" + metaTalesNFT.deployTransaction.hash);

  console.log("\nUpdate your .env file with:");
  console.log(`MUMBAI_CONTRACT_ADDRESS=${metaTalesNFT.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });