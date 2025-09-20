# Meta-Tales

**A blockchain-powered NFT marketplace for stories, poems, and comics.**

## Overview
.
Writers, poets, and comic artists face ongoing challenges in protecting their creative works, establishing true digital ownership, and earning fair compensation. Existing platforms like Wattpad, Webtoon, and Medium provide visibility but lack mechanisms for secure ownership, transparent monetization, and controlled distribution.

Meta-Tales solves this by enabling creators to upload their works, mint them as NFTs on IPFS, and prove ownership with royalties via an ERC-721 smart contract. Our Next.js frontend integrates MetaMask + Wagmi for seamless minting and viewing of NFTs, providing secure ownership, provenance, and monetization for digital literary works in Web3.

## Current Status

✅ **Completed Features:**
- Smart contract development with ERC-721 + EIP-2981 royalties
- IPFS integration for decentralized storage
- Complete frontend application with 4 main pages
- Web3 wallet connectivity (MetaMask)
- Responsive UI/UX design

🚧 **In Development:**
- Smart contract integration with frontend
- Live minting functionality
- Blockchain data reading for gallery

## Features

### 🎯 **Core Features**
- **Digital Ownership**: Mint stories, poems, and comics as NFTs with verifiable ownership
- **IPFS Storage**: Decentralized storage ensuring permanent availability of creative works
- **Royalty System**: Built-in EIP-2981 royalties for ongoing creator compensation
- **Web3 Integration**: MetaMask connectivity for seamless blockchain interactions

### 📱 **Application Pages**
- **Homepage**: Hero section, features overview, and call-to-action
- **Mint Page**: Upload literary works and create NFTs with metadata
- **Gallery**: Browse and discover existing literary NFTs with filtering
- **Dashboard**: Manage your NFT collection and track earnings

## Project Structure

```
Meta-Tales/
├── contract/                    # Hardhat development environment
│   ├── contracts/
│   │   └── MetaTalesNFT.sol    # ERC-721 contract with royalties
│   ├── scripts/
│   │   └── deploy.js           # Deployment script
│   ├── test/
│   │   └── MetaTalesNFT.test.js # Comprehensive test suite
│   └── utils/
│       └── ipfs-uploader.js    # IPFS upload utilities
├── app/                        # Next.js frontend application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── mint/          # Mint page
│   │   │   ├── gallery/       # Gallery page
│   │   │   └── dashboard/     # Dashboard page
│   │   └── components/
│   │       ├── Navigation.tsx  # Main navigation
│   │       └── Web3Provider.tsx # Web3 setup
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension
- **Git** for version control

### 🚀 **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anubhavick/Meta-Tales.git
   cd Meta-Tales
   ```

2. **Set up the smart contract environment**
   ```bash
   cd contract
   npm install
   
   # Compile contracts
   npx hardhat compile
   
   # Run comprehensive test suite (28 tests)
   npx hardhat test
   ```

3. **Set up the frontend application**
   ```bash
   cd ../app
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:3000`
   - The app will be running with all pages accessible:
     - **Homepage**: `/`
     - **Mint Page**: `/mint`
     - **Gallery**: `/gallery` 
     - **Dashboard**: `/dashboard`

### 🧪 **Testing**

**Smart Contract Tests:**
```bash
cd contract
npm test                    # Run all 28 tests
npx hardhat coverage       # Generate coverage report
```

**Frontend Build:**
```bash
cd app
npm run build              # Build for production
npm run start              # Start production server
```

### 🌐 **Optional: Deploy to Testnet**

1. **Set up environment variables**
   ```bash
   cd contract
   cp .env.example .env
   # Add your private key and Sepolia RPC URL
   ```

2. **Deploy to Sepolia testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## Technology Stack

### 🔗 **Blockchain**
- **Ethereum** (Sepolia testnet for development)
- **Solidity** ^0.8.20 for smart contracts
- **Hardhat** development environment
- **OpenZeppelin** for secure contract templates

### 🎨 **Frontend**
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for responsive design
- **Wagmi + RainbowKit** for Web3 connectivity
- **Lucide React** for icons

### 💾 **Storage & APIs**
- **IPFS** via nft.storage for decentralized storage
- **MetaMask** for wallet integration
- **ethers.js** for blockchain interactions

## Demo Flow

### 🎯 **Current Experience** (Frontend Only)
1. **Explore Homepage**: View features and platform overview
2. **Browse Gallery**: See mock literary NFTs with filtering/search
3. **Visit Mint Page**: Experience the upload form and minting UI
4. **Check Dashboard**: View portfolio management interface

### 🔮 **Coming Soon** (With Web3 Integration)
1. **Connect Wallet**: Link your MetaMask wallet
2. **Upload Content**: Submit your story, poem, or comic to IPFS
3. **Mint NFT**: Transform your work into a blockchain asset
4. **Live Gallery**: Browse real NFTs from the blockchain
5. **Trade & Earn**: Buy, sell, and collect with automatic royalties

## Development Progress

### ✅ **Completed (Hours 0-9)**
- [x] Project setup and git initialization
- [x] Hardhat environment with OpenZeppelin contracts  
- [x] ERC-721 NFT contract with EIP-2981 royalties
- [x] IPFS integration utilities and testing
- [x] Complete Next.js frontend with 4 pages
- [x] Web3Provider setup with Wagmi/RainbowKit
- [x] Responsive UI design with Tailwind CSS

### 🚧 **In Progress (Hours 9-12)**
- [ ] Connect frontend to smart contracts
- [ ] Implement live minting functionality
- [ ] Add blockchain data reading for gallery
- [ ] Deploy and test on Sepolia testnet

### 📋 **Planned (Hours 12-24)**
- [ ] Advanced marketplace features
- [ ] Enhanced UI/UX polish
- [ ] Comprehensive testing
- [ ] Production deployment

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Run tests**: Ensure all tests pass
5. **Submit a pull request**

### 🐛 **Found a Bug?**
- Check existing issues first
- Create a new issue with reproduction steps
- Include environment details (OS, Node version, etc.)

### 💡 **Have an Idea?**
- Open an issue to discuss the feature
- Wait for feedback before implementation
- Follow the existing code style and patterns

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Web3 literary community**
