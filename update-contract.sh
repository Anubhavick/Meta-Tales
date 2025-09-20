#!/bin/bash

# Script to update contract address in contracts.json after deployment
# Usage: ./update-contract.sh <network> <contract-address>

if [ $# -ne 2 ]; then
    echo "Usage: $0 <network> <contract-address>"
    echo "Example: $0 bscTestnet 0x1234567890123456789012345678901234567890"
    exit 1
fi

NETWORK=$1
CONTRACT_ADDRESS=$2

# Validate contract address format
if [[ ! $CONTRACT_ADDRESS =~ ^0x[a-fA-F0-9]{40}$ ]]; then
    echo "Error: Invalid contract address format. Must be 42 characters starting with 0x"
    exit 1
fi

CONTRACTS_FILE="app/src/config/contracts.json"

if [ ! -f "$CONTRACTS_FILE" ]; then
    echo "Error: contracts.json not found at $CONTRACTS_FILE"
    exit 1
fi

# Create backup
cp "$CONTRACTS_FILE" "$CONTRACTS_FILE.backup"

# Update the contract address using sed
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"$NETWORK\":/&\n      \"lastUpdated\": \"$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")\",/g" "$CONTRACTS_FILE"
    sed -i '' "s/\"address\": \"TBD\"/\"address\": \"$CONTRACT_ADDRESS\"/g" "$CONTRACTS_FILE"
else
    # Linux
    sed -i "s/\"$NETWORK\":/&\n      \"lastUpdated\": \"$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")\",/g" "$CONTRACTS_FILE"
    sed -i "s/\"address\": \"TBD\"/\"address\": \"$CONTRACT_ADDRESS\"/g" "$CONTRACTS_FILE"
fi

echo "✅ Updated $NETWORK contract address to: $CONTRACT_ADDRESS"
echo "📁 Backup saved as: $CONTRACTS_FILE.backup"
echo "🔄 Please restart your frontend dev server to pick up the changes"