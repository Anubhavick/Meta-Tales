# Meta Tales - NFT Marketplace for Digital Literature

A blockchain-powered NFT marketplace for stories, poems, and comics. Writers, poets, and comic artists can upload their creative works, mint them as NFTs on IPFS, and prove ownership with royalties via ERC-721 smart contracts.

## Features

- 📚 **Multi-format Support**: Stories, poems, and comics
- 🔗 **Blockchain Integration**: ERC-721 NFTs with royalty support
- 📦 **IPFS Storage**: Decentralized content storage
- 💰 **Royalty System**: Automatic royalty distribution to creators
- 🦊 **MetaMask Integration**: Seamless wallet connection
- 🎨 **Modern UI**: Built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum, ethers.js, ERC-721 smart contracts
- **Storage**: IPFS via Pinata
- **Wallet**: MetaMask integration
- **UI Components**: Radix UI, Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Pinata account for IPFS storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anubhavick/Meta-Tales.git
   cd Meta-Tales
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Pinata API keys:
   ```env
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key_here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Smart Contract

The platform uses a custom ERC-721 smart contract with the following features:

- **NFT Minting**: Creators can mint their works as NFTs
- **Royalty Support**: Implements EIP-2981 for automatic royalty payments
- **Creator Attribution**: Tracks original creators for each token
- **Metadata Storage**: Links to IPFS-stored metadata

### Contract Functions

```solidity
function mintNFT(address to, string memory tokenURI, uint256 royaltyPercentage)
function royaltyInfo(uint256 tokenId, uint256 salePrice)
function getCreator(uint256 tokenId)
```

## Usage

### For Creators

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Create Content**: Upload your story, poem, or comic
3. **Set Metadata**: Add title, description, genre, and royalty percentage
4. **Mint NFT**: Deploy your work as an NFT on the blockchain
5. **Earn Royalties**: Receive automatic payments from secondary sales

### For Collectors

1. **Browse Marketplace**: Discover unique literary works
2. **Filter & Search**: Find content by type, genre, or creator
3. **Purchase NFTs**: Buy NFTs directly with ETH
4. **View Collection**: Manage your purchased NFTs

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create/            # NFT creation page
│   ├── marketplace/       # Marketplace browse page
│   ├── my-nfts/          # User's NFT collection
│   └── page.tsx          # Homepage
├── components/            # Reusable React components
│   ├── Header.tsx        # Navigation header
│   ├── WalletButton.tsx  # Wallet connection button
│   └── WalletProvider.tsx # Wallet context provider
├── lib/                  # Utility libraries
│   ├── ethereum.ts       # Blockchain interactions
│   └── ipfs.ts          # IPFS upload/download
├── types/               # TypeScript type definitions
└── contracts/           # Smart contract source code
```

## Development

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_PINATA_API_KEY`: Your Pinata API key for IPFS uploads
- `NEXT_PUBLIC_PINATA_SECRET_KEY`: Your Pinata secret key
- `NEXT_PUBLIC_BASE_URL`: Base URL for your application

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Smart contract deployment to testnet/mainnet
- [ ] Enhanced marketplace features (bidding, offers)
- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] Advanced search and filtering
- [ ] Creator verification system
- [ ] Social features (comments, likes, follows)
- [ ] Mobile app development

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@metatales.io or join our Discord community.

---

Built with ❤️ for the creative community
