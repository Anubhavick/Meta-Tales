# Meta-Tales

**A blockchain-powered NFT marketplace for stories, poems, and comics with multi-network support.**

## 🎯 Overview

Writers, poets, and comic artists face challenges in protecting their creative works, establishing digital ownership, and earning fair compensation. Meta-Tales solves this by enabling creators to mint their literary works as NFTs with built-in royalties on multiple blockchain networks.

## ✨ Current Status

✅ **Fully Working Features:**
- ✅ Smart contract deployed and working on multiple testnets
- ✅ Complete frontend with Web3 integration  
- ✅ IPFS storage for decentralized content hosting
- ✅ Multi-network support (Hardhat, Goerli, Mumbai, Sepolia, BSC, Optimism, Arbitrum)
- ✅ NFT minting functionality working end-to-end
- ✅ Network switching and detection
- ✅ Transaction history tracking
- ✅ Comprehensive dashboard with analytics

🚀 **Ready for Demo!** - Full platform working on localhost and testnets

## 🚀 Quick Start (Choose Your Method)

### Method 1: Local Development (Fastest)
Perfect for testing and development with free transactions.

### Method 2: Testnet Deployment  
Deploy to real testnets for full blockchain experience.

---

## 🏠 Method 1: Local Development Setup

**Requirements:**
- Node.js (v18+)
- npm/yarn
- MetaMask browser extension

### Step 1: Clone and Install

```bash
git clone https://github.com/Anubhavick/Meta-Tales.git
cd Meta-Tales

# Install contract dependencies
cd contract
npm install

# Install frontend dependencies  
cd ../app
npm install
```

### Step 2: Start Local Blockchain

```bash
# Terminal 1 - Start Hardhat Network
cd contract
npx hardhat node

# ✅ You'll see:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# Chain Id: 31337
# [Account addresses and private keys listed]
```

### Step 3: Deploy Contract

```bash
# Terminal 2 - Deploy to local network
cd contract
npx hardhat run scripts/deploy.js --network localhost

# ✅ Expected output:
# ✅ Meta-Tales NFT contract deployed successfully!
# 📋 Contract Details:
# - Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
# - Network: localhost (31337)
```

### Step 4: Start Frontend

```bash
# Terminal 3 - Start Next.js app
cd app
npm run dev

# ✅ Open http://localhost:3000
```

### Step 5: Configure MetaMask

1. **Add Hardhat Network:**
   - Network Name: `Hardhat Localhost`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Import Test Account:**
   - Copy any private key from Hardhat node output
   - Import to MetaMask → You'll have 10,000 ETH!

### Step 6: Test the App! 🎉

1. **Connect Wallet** → Should show "Connected to Hardhat"
2. **Go to Mint Page** → Create your first NFT
3. **Check Dashboard** → View your NFTs and transaction history
4. **Visit Gallery** → Browse all minted NFTs

---

## 🌐 Method 2: Testnet Deployment

Deploy to real blockchain testnets for full Web3 experience.

### Supported Networks

| Network | Currency | Speed | Gas Cost | Faucet | Best For |
|---------|----------|-------|----------|---------|----------|
| **Hardhat** | ETH | Instant | Free | Built-in | Local development |
| **Goerli** | ETH | Fast | Free | [Faucet](https://goerlifaucet.com/) | Stable testing |
| **Mumbai** | MATIC | Very Fast | Very Low | [Faucet](https://faucet.polygon.technology/) | Fast testing |
| **BSC Testnet** | BNB | Very Fast | Very Low | [Faucet](https://testnet.binance.org/faucet-smart) | Binance ecosystem |
| **Sepolia** | ETH | Medium | Free | [Faucet](https://sepoliafaucet.com/) | Official Ethereum |
| **Optimism Goerli** | ETH | Fast | Very Low | [Faucet](https://community.optimism.io/docs/useful-tools/faucets/) | Layer 2 testing |
| **Arbitrum Goerli** | ETH | Fast | Very Low | [Faucet](https://bridge.arbitrum.io/) | Layer 2 alternative |

### Setup Environment

```bash
cd contract
cp .env.example .env
```

Add your configuration:
```bash
# Your wallet private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# RPC URLs (get from Alchemy/Infura or use public endpoints)
GOERLI_URL=https://goerli.infura.io/v3/YOUR_KEY
MUMBAI_URL=https://rpc.ankr.com/polygon_mumbai
BSC_TESTNET_URL=https://data-seed-prebsc-1-s1.binance.org:8545
# ... add others as needed

# API Keys for contract verification (optional)
ETHERSCAN_API_KEY=your_key_here
POLYGONSCAN_API_KEY=your_key_here
```

### Deploy to Specific Network

```bash
# Deploy to Mumbai (Polygon) - Recommended for beginners
npm run deploy:mumbai

# Deploy to Goerli (Ethereum)  
npm run deploy:goerli

# Deploy to BSC Testnet
npm run deploy:bsc

# Deploy to all networks at once
npm run deploy:all
```

### Update Contract Address

After deployment, update the contract address:

```bash
# Copy the deployed address and run:
./update-contract.sh <network> <contract_address>

# Example:
./update-contract.sh mumbai 0x1234567890123456789012345678901234567890
```

---

## 🎯 Features Overview

### 🔗 **Blockchain Features**
- **Multi-Network Support**: Deploy on 7+ different networks
- **ERC-721 NFTs**: Standard NFT implementation with metadata
- **EIP-2981 Royalties**: Built-in creator royalties (5-10%)
- **IPFS Storage**: Decentralized storage for content and metadata
- **Upgradeable**: Owner can upgrade contract functionality

### 📱 **Frontend Features**
- **4 Main Pages**: Home, Mint, Gallery, Dashboard
- **Network Switching**: Automatic network detection and switching
- **Real-time Data**: Live blockchain data and transaction tracking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Web3 Integration**: MetaMask, WalletConnect support

### 🎨 **Content Types Supported**
- **Stories**: Upload text files or write directly
- **Poems**: Short-form literary content
- **Comics**: Image-based storytelling
- **Custom Metadata**: Title, description, royalties

---

## 📁 Project Structure

```
Meta-Tales/
├── contract/                    # Smart contract development
│   ├── contracts/MetaTalesNFT.sol     # Main ERC-721 contract
│   ├── scripts/
│   │   ├── deploy.js                  # Local deployment
│   │   ├── deploy-mumbai.js           # Mumbai deployment  
│   │   ├── deploy-goerli.js           # Goerli deployment
│   │   └── deploy-all-networks.js     # Multi-network deployment
│   ├── hardhat.config.js              # Network configurations
│   └── package.json                   # Contract dependencies
│
├── app/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                       # App Router pages
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── mint/page.tsx          # NFT minting
│   │   │   ├── gallery/page.tsx       # NFT browser
│   │   │   └── dashboard/page.tsx     # User dashboard
│   │   ├── components/
│   │   │   ├── Web3Provider.tsx       # Web3 setup
│   │   │   ├── NetworkSelector.tsx    # Network switching
│   │   │   └── Navigation.tsx         # App navigation
│   │   ├── hooks/
│   │   │   ├── useMintNFT.ts          # Minting logic
│   │   │   ├── useUserNFTs.ts         # NFT fetching
│   │   │   └── useMetaMaskHistory.ts  # Transaction history
│   │   └── config/contracts.json      # Contract addresses
│   └── package.json
│
├── NETWORKS.md                  # Detailed network guide
├── BSC_DEPLOYMENT_GUIDE.md      # BSC-specific instructions
└── README.md                    # This file
```

---

## 🛠️ Available Scripts

### Contract Scripts
```bash
cd contract

# Development
npm run compile          # Compile contracts
npm test                # Run test suite
npm run deploy          # Deploy to localhost
npm run deploy:mumbai   # Deploy to Mumbai testnet
npm run deploy:goerli   # Deploy to Goerli testnet  
npm run deploy:bsc      # Deploy to BSC testnet
npm run deploy:all      # Deploy to all networks

# Testing
npx hardhat test        # Run comprehensive tests
npx hardhat coverage   # Generate coverage report
npx hardhat node       # Start local blockchain
```

### Frontend Scripts
```bash
cd app

# Development
npm run dev             # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Type checking
npm run type-check      # Check TypeScript types
```

---

## 🧪 Testing

### Smart Contract Tests
```bash
cd contract
npm test

# ✅ Expected output:
# MetaTalesNFT Contract Tests
#   ✓ Should deploy with correct name and symbol
#   ✓ Should mint NFT with metadata
#   ✓ Should set royalty information  
#   ✓ Should handle royalty payments
#   ... 28 tests total
```

### Frontend Testing
```bash
cd app
npm run build           # Verify build works
npm run type-check      # Check TypeScript
```

---

## 🔧 Troubleshooting

### Common Issues

**🔴 "Network not supported"**
- Make sure you're connected to a supported network
- Check the Networks tab in Dashboard to switch networks

**🔴 "Contract not deployed"**  
- Run deployment script for your current network
- Update contract address in contracts.json

**🔴 "Insufficient funds"**
- Get test tokens from the appropriate faucet
- Each network has different faucets (see table above)

**🔴 MetaMask connection issues**
- Refresh the page and reconnect
- Make sure you're on the correct network
- Import the correct private key for testnets

### Getting Test Tokens

1. **Mumbai (MATIC)**: https://faucet.polygon.technology/
2. **Goerli (ETH)**: https://goerlifaucet.com/  
3. **BSC Testnet (BNB)**: https://testnet.binance.org/faucet-smart
4. **Sepolia (ETH)**: https://sepoliafaucet.com/

---

## 🎉 Demo Flow

### Complete User Journey

1. **🔗 Connect Wallet**
   - Click "Connect Wallet" in navigation
   - Choose MetaMask and connect

2. **🌐 Select Network**  
   - Go to Dashboard → Networks tab
   - Choose your preferred network (Hardhat for local, Mumbai for testnet)
   - Get test tokens if needed

3. **✍️ Create Your First NFT**
   - Go to Mint page
   - Fill in title, description, content type
   - Upload cover image and content file
   - Set royalty percentage (5-10%)
   - Click "Mint NFT"

4. **📊 View Your Portfolio**
   - Check Dashboard for your minted NFTs
   - View transaction history
   - See analytics and earnings

5. **🎨 Browse Gallery**
   - Explore all NFTs on the platform
   - Filter by content type
   - View detailed NFT information

---

## 🚀 Production Deployment

### Deploy to Mainnet
```bash
# Set up mainnet configuration
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_KEY
ETHERSCAN_API_KEY=your_key

# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

### Deploy Frontend
```bash
cd app
npm run build

# Deploy to Vercel, Netlify, or your preferred platform
```

---

## � Additional Resources

- **[NETWORKS.md](NETWORKS.md)** - Detailed network configuration guide
- **[BSC_DEPLOYMENT_GUIDE.md](BSC_DEPLOYMENT_GUIDE.md)** - BSC-specific deployment instructions
- **Hardhat Documentation**: https://hardhat.org/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Wagmi Documentation**: https://wagmi.sh/docs

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎯 Ready to mint your literary masterpieces? Start with the Quick Start guide above!**

*Built with ❤️ for the Web3 literary community*
