# Meta-Tales Multi-Network Setup Guide

## 🌐 Supported Networks

Meta-Tales now supports deployment and testing on multiple blockchain networks, giving you flexibility to choose the best option for your needs.

### Available Networks

| Network | Currency | Speed | Gas Cost | Difficulty | Best For |
|---------|----------|-------|----------|------------|----------|
| **Hardhat Local** | ETH | Instant | Free | Easy | Local development |
| **Goerli** | ETH | Fast | Free | Easy | Stable testing |
| **Mumbai** | MATIC | Very Fast | Very Low | Easy | Fast/cheap testing |
| **Sepolia** | ETH | Medium | Free | Medium | Official Ethereum testnet |
| **Optimism Goerli** | ETH | Fast | Very Low | Medium | Layer 2 testing |
| **Arbitrum Goerli** | ETH | Fast | Very Low | Medium | Layer 2 alternative |
| **BSC Testnet** | BNB | Very Fast | Very Low | Easy | Binance ecosystem |

## 🚀 Quick Start

### 1. Environment Setup

Copy the example environment file and add your API keys:

```bash
cd contract
cp .env.example .env
```

Required environment variables:
```bash
# RPC URLs (get from Alchemy, Infura, or public endpoints)
GOERLI_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/YOUR_PROJECT_ID
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
OPTIMISM_GOERLI_RPC_URL=https://goerli.optimism.io
ARBITRUM_GOERLI_RPC_URL=https://goerli-rollup.arbitrum.io/rpc
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545

# Private key for deployment (NEVER commit this!)
PRIVATE_KEY=your_wallet_private_key

# Block explorer API keys for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key
```

### 2. Get Test Tokens

Before deploying, you need test tokens for transaction fees:

- **Goerli ETH**: https://goerlifaucet.com/
- **Mumbai MATIC**: https://faucet.polygon.technology/
- **Sepolia ETH**: https://sepoliafaucet.com/
- **Optimism Goerli ETH**: https://community.optimism.io/docs/useful-tools/faucets/
- **Arbitrum Goerli ETH**: https://bridge.arbitrum.io/
- **BSC Testnet BNB**: https://testnet.binance.org/faucet-smart

### 3. Deploy to Networks

#### Deploy to All Networks
```bash
cd contract
npm run deploy:all
```

#### Deploy to Specific Networks
```bash
# Individual network deployments
npm run deploy:goerli     # Deploy to Goerli
npm run deploy:mumbai     # Deploy to Mumbai
npm run deploy:sepolia    # Deploy to Sepolia
npm run deploy:optimism   # Deploy to Optimism Goerli
npm run deploy:arbitrum   # Deploy to Arbitrum Goerli
npm run deploy:bsc        # Deploy to BSC Testnet
```

## 🎯 Network Recommendations

### For Local Development
**Use Hardhat Local Network**
- ✅ Free transactions
- ✅ Instant confirmation
- ✅ Complete control
- ✅ 10,000 ETH per account
- ❌ Local only

### For Public Testing
**Recommended: Goerli or Mumbai**

**Goerli Testnet:**
- ✅ Most stable Ethereum testnet
- ✅ Multiple reliable faucets
- ✅ Close to mainnet behavior
- ✅ Wide ecosystem support
- ❌ Sometimes has faucet queues

**Mumbai Testnet:**
- ✅ Extremely fast transactions
- ✅ Very cheap gas fees
- ✅ Excellent faucets
- ✅ Great for rapid testing
- ❌ Different from Ethereum (Polygon)

### For Layer 2 Testing
**Use Optimism or Arbitrum Goerli**
- ✅ Experience Layer 2 scaling
- ✅ Low transaction costs
- ✅ Ethereum-compatible
- ❌ More complex setup
- ❌ Bridge required for funds

## 🔧 Network Switching in Frontend

The Meta-Tales dashboard includes a **Networks** tab where you can:

1. **View all supported networks** with their properties
2. **Switch between networks** with one click
3. **See deployment status** for each network
4. **Access faucets** directly from the interface
5. **View block explorers** for each network

### Network Selector Features

- **Real-time network status** with connection indicators
- **Contract deployment status** for each network
- **Network recommendations** based on your use case
- **Direct links to faucets** and block explorers
- **Gas price and speed information** for each network
- **Pros and cons** to help you choose

## 📝 Configuration Files

### contracts.json
Contains network configurations and deployed contract addresses:

```json
{
  "networks": {
    "localhost": {
      "name": "Hardhat Localhost",
      "chainId": 31337,
      "contracts": {
        "MetaTalesNFT": {
          "address": "0x...",
          "deployedAt": "2024-01-01T00:00:00.000Z"
        }
      }
    },
    "goerli": {
      "name": "Goerli Testnet", 
      "chainId": 5,
      "faucet": "https://goerlifaucet.com/",
      "explorer": "https://goerli.etherscan.io",
      "contracts": {
        "MetaTalesNFT": {
          "address": "TBD"
        }
      }
    }
  }
}
```

### hardhat.config.js
Network configurations for deployment:

```javascript
module.exports = {
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 20000000000
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 8000000000
    }
    // ... other networks
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

**1. Insufficient Balance**
```
❌ Insufficient balance! Get test tokens from: [faucet_url]
```
**Solution**: Visit the faucet URL and get test tokens for your wallet.

**2. RPC URL Not Working**
```
❌ Error deploying to network: could not detect network
```
**Solution**: Check your RPC URL in `.env` file. Try a different RPC provider.

**3. Gas Price Too Low**
```
❌ replacement transaction underpriced
```
**Solution**: Increase gas price in `hardhat.config.js` for that network.

**4. Network Not Available in MetaMask**
```
❌ User rejected the request
```
**Solution**: Add the network manually to MetaMask or use the built-in network switcher.

### Getting Help

1. **Check faucet status**: Some faucets have rate limits or requirements
2. **Verify RPC endpoints**: Use public RPC URLs if private ones fail
3. **Check network status**: Some testnets may be experiencing issues
4. **Review gas prices**: Adjust gas prices in hardhat config if needed

## 🎉 Success Indicators

After successful deployment, you should see:

1. **Contract addresses** in the terminal output
2. **Block explorer links** to view transactions
3. **Updated contracts.json** with new addresses
4. **Green indicators** in the frontend Networks tab
5. **Successful test minting** on the deployed contracts

## 📚 Additional Resources

- [Hardhat Network Management](https://hardhat.org/hardhat-network/)
- [MetaMask Network Configuration](https://metamask.zendesk.com/hc/en-us/articles/360043227612)
- [Ethereum Testnet Guide](https://ethereum.org/en/developers/docs/networks/#testnets)
- [Polygon Mumbai Documentation](https://docs.polygon.technology/tools/gas/matic-faucet/)
- [Layer 2 Networks Overview](https://ethereum.org/en/layer-2/)

---

**Happy testing! 🚀** Choose the network that best fits your development needs and start building on Meta-Tales.