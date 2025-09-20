# Meta-Tales

**A blockchain-powered NFT marketplace for stories, poems, and comics.**

## Overview

Writers, poets, and comic artists face ongoing challenges in protecting their creative works, establishing true digital ownership, and earning fair compensation. Existing platforms like Wattpad, Webtoon, and Medium provide visibility but lack mechanisms for secure ownership, transparent monetization, and controlled distribution.

Meta-Tales solves this by enabling creators to upload their works, mint them as NFTs on IPFS, and prove ownership with royalties via an ERC-721 smart contract. Our Next.js frontend integrates MetaMask + ethers.js for seamless minting and viewing of NFTs, providing secure ownership, provenance, and monetization for digital literary works in Web3.

## Features

- **Digital Ownership**: Mint stories, poems, and comics as NFTs with verifiable ownership
- **IPFS Storage**: Decentralized storage ensuring permanent availability of creative works
- **Royalty System**: Built-in EIP-2981 royalties for ongoing creator compensation
- **Web3 Integration**: MetaMask connectivity for seamless blockchain interactions
- **Marketplace**: View, trade, and discover literary NFTs
- **Creator Dashboard**: Manage your literary portfolio and earnings

## Project Structure

```
Meta-Tales/
├── contract/          # Hardhat development environment
│   ├── contracts/     # Solidity smart contracts
│   ├── scripts/       # Deployment scripts
│   └── test/         # Contract tests
├── app/              # Next.js frontend application
│   ├── pages/        # React pages (home, mint, gallery, dashboard)
│   ├── components/   # Reusable React components
│   └── api/         # API routes for IPFS uploads
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16+)
- MetaMask wallet
- nft.storage API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anubhavick/Meta-Tales.git
   cd Meta-Tales
   ```

2. **Set up the smart contract**
   ```bash
   cd contract
   npm install
   npx hardhat compile
   npx hardhat test
   ```

3. **Set up the frontend**
   ```bash
   cd ../app
   npm install
   npm run dev
   ```

4. **Deploy to testnet**
   ```bash
   cd ../contract
   npx hardhat run scripts/deploy.js --network sepolia
   ```

## Technology Stack

- **Blockchain**: Ethereum (Sepolia testnet)
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: Next.js, TypeScript, ethers.js
- **Storage**: IPFS via nft.storage
- **Wallet**: MetaMask integration

## Demo Flow

1. **Connect Wallet**: Link your MetaMask wallet
2. **Upload Content**: Submit your story, poem, or comic
3. **Mint NFT**: Transform your work into a blockchain asset
4. **Gallery**: Browse and discover literary NFTs
5. **Trade**: Buy, sell, and collect creative works with built-in royalties

## Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
