const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

// Configuration for each network
const NETWORKS = {
  goerli: {
    name: "Goerli Testnet",
    explorer: "https://goerli.etherscan.io/tx/",
    faucet: "https://goerlifaucet.com/"
  },
  mumbai: {
    name: "Mumbai Testnet", 
    explorer: "https://mumbai.polygonscan.com/tx/",
    faucet: "https://faucet.polygon.technology/"
  },
  sepolia: {
    name: "Sepolia Testnet",
    explorer: "https://sepolia.etherscan.io/tx/",
    faucet: "https://sepoliafaucet.com/"
  },
  optimismGoerli: {
    name: "Optimism Goerli",
    explorer: "https://goerli-optimism.etherscan.io/tx/",
    faucet: "https://community.optimism.io/docs/useful-tools/faucets/"
  },
  arbitrumGoerli: {
    name: "Arbitrum Goerli",
    explorer: "https://goerli.arbiscan.io/tx/",
    faucet: "https://bridge.arbitrum.io/"
  },
  bscTestnet: {
    name: "BSC Testnet",
    explorer: "https://testnet.bscscan.com/tx/",
    faucet: "https://testnet.binance.org/faucet-smart"
  }
};

async function deployToNetwork(networkName) {
  console.log(`\n🚀 Deploying to ${NETWORKS[networkName].name}...`);
  
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`📝 Deploying with account: ${deployer.address}`);
    
    // Get balance
    const balance = await deployer.getBalance();
    console.log(`💰 Account balance: ${hre.ethers.utils.formatEther(balance)} ${getNetworkCurrency(networkName)}`);
    
    if (balance.eq(0)) {
      console.log(`❌ Insufficient balance! Please get test tokens from: ${NETWORKS[networkName].faucet}`);
      return null;
    }

    // Deploy MetaTalesNFT contract
    console.log("📦 Deploying MetaTalesNFT contract...");
    const MetaTalesNFT = await hre.ethers.getContractFactory("MetaTalesNFT");
    const metaTalesNFT = await MetaTalesNFT.deploy();
    
    await metaTalesNFT.deployed();
    console.log(`✅ MetaTalesNFT deployed to: ${metaTalesNFT.address}`);
    console.log(`🔗 View on explorer: ${NETWORKS[networkName].explorer}${metaTalesNFT.deployTransaction.hash}`);

    return {
      network: networkName,
      address: metaTalesNFT.address,
      txHash: metaTalesNFT.deployTransaction.hash,
      deployer: deployer.address,
      blockNumber: metaTalesNFT.deployTransaction.blockNumber,
      gasUsed: metaTalesNFT.deployTransaction.gasLimit.toString()
    };

  } catch (error) {
    console.log(`❌ Error deploying to ${networkName}:`, error.message);
    return null;
  }
}

function getNetworkCurrency(networkName) {
  switch (networkName) {
    case 'mumbai': return 'MATIC';
    case 'bscTestnet': return 'BNB';
    default: return 'ETH';
  }
}

async function updateContractsConfig(deployments) {
  const contractsPath = path.join(__dirname, '../../app/src/config/contracts.json');
  let contracts;
  
  try {
    contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
  } catch (error) {
    console.log("📄 Creating new contracts.json file...");
    contracts = { networks: {} };
  }

  // Update each successful deployment
  deployments.forEach(deployment => {
    if (deployment) {
      const networkKey = deployment.network;
      
      if (!contracts.networks[networkKey]) {
        contracts.networks[networkKey] = {
          name: NETWORKS[deployment.network].name,
          chainId: getChainId(deployment.network),
          rpcUrl: `\${${deployment.network.toUpperCase()}_RPC_URL}`,
          faucet: NETWORKS[deployment.network].faucet,
          explorer: NETWORKS[deployment.network].explorer.replace('/tx/', ''),
          contracts: {}
        };
      }

      contracts.networks[networkKey].contracts.MetaTalesNFT = {
        address: deployment.address,
        deployedAt: new Date().toISOString(),
        deployer: deployment.deployer,
        txHash: deployment.txHash,
        blockNumber: deployment.blockNumber,
        gasUsed: deployment.gasUsed
      };
    }
  });

  fs.writeFileSync(contractsPath, JSON.stringify(contracts, null, 2));
  console.log(`\n📝 Updated contracts.json with deployment addresses`);
}

function getChainId(networkName) {
  const chainIds = {
    goerli: 5,
    mumbai: 80001,
    sepolia: 11155111,
    optimismGoerli: 420,
    arbitrumGoerli: 421613,
    bscTestnet: 97
  };
  return chainIds[networkName] || 0;
}

async function main() {
  console.log("🌐 Meta-Tales Multi-Network Deployment");
  console.log("=====================================");
  
  const deployments = [];
  
  // Get available networks from Hardhat config
  const availableNetworks = Object.keys(hre.config.networks).filter(
    name => name !== 'hardhat' && name !== 'localhost' && NETWORKS[name]
  );
  
  console.log(`📡 Found ${availableNetworks.length} testnet configurations:`);
  availableNetworks.forEach(network => {
    console.log(`   • ${NETWORKS[network].name} (${network})`);
  });

  // Deploy to each network
  for (const networkName of availableNetworks) {
    await hre.changeNetwork(networkName);
    const deployment = await deployToNetwork(networkName);
    deployments.push(deployment);
    
    // Small delay between deployments
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  console.log("\n📊 Deployment Summary");
  console.log("====================");
  
  const successful = deployments.filter(d => d !== null);
  const failed = deployments.filter(d => d === null);
  
  console.log(`✅ Successful deployments: ${successful.length}`);
  console.log(`❌ Failed deployments: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log("\n🎉 Successfully deployed to:");
    successful.forEach(deployment => {
      console.log(`   • ${NETWORKS[deployment.network].name}: ${deployment.address}`);
    });
    
    // Update contracts configuration
    await updateContractsConfig(deployments);
  }
  
  if (failed.length > 0) {
    console.log("\n⚠️  Failed networks (check RPC URLs and balances):");
    const failedNetworks = availableNetworks.filter((_, i) => deployments[i] === null);
    failedNetworks.forEach(network => {
      console.log(`   • ${NETWORKS[network].name} - Check: ${NETWORKS[network].faucet}`);
    });
  }

  console.log("\n🔧 Next steps:");
  console.log("   1. Verify contracts on block explorers");
  console.log("   2. Test minting on deployed networks");
  console.log("   3. Update frontend to use new contract addresses");
}

// Helper function to change network (Hardhat Runtime Environment)
hre.changeNetwork = function(networkName) {
  hre.network.name = networkName;
  hre.network.config = hre.config.networks[networkName];
  hre.network.provider = new hre.ethers.providers.JsonRpcProvider(
    hre.network.config.url
  );
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  });