#!/bin/bash

# Meta-Tales Quick Setup Script
echo "🚀 Starting Meta-Tales setup..."

# Check if we're in the right directory
if [ ! -d "contract" ] || [ ! -d "app" ]; then
  echo "❌ Please run this script from the Meta-Tales root directory"
  exit 1
fi

# Setup contracts
echo "📄 Setting up contracts..."
cd contract
npm install > /dev/null 2>&1
npx hardhat compile

echo "🧪 Running contract tests..."
npx hardhat test

echo ""
echo "✅ Contract setup complete!"
echo ""

# Setup frontend
echo "🎨 Setting up frontend..."
cd ../app
npm install > /dev/null 2>&1

echo ""
echo "✅ Frontend setup complete!"
echo ""

echo "🎯 Next steps:"
echo "1. Start blockchain: cd contract && npx hardhat node"
echo "2. Deploy contract: cd contract && npx hardhat run scripts/deploy.js --network localhost"  
echo "3. Start frontend: cd app && npm run dev"
echo "4. Configure MetaMask with local network (Chain ID: 31337, RPC: http://127.0.0.1:8545)"
echo ""
echo "📖 Full instructions available in README.md"