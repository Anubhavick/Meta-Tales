# 🚀 Get BSC Testnet BNB and Deploy Contract

## Step 1: Get Test BNB

1. **Visit BSC Testnet Faucet**: https://testnet.binance.org/faucet-smart
2. **Connect your wallet** (the same one used for deployment)
3. **Request BNB** (you'll get 0.1 BNB which is enough for deployment)
4. **Wait** for the transaction to confirm (usually 1-2 minutes)

Your wallet address: `0xd05B9D53Bf985D7Cdf7e820Bc77f0Ef8F6491c6d`

## Step 2: Deploy Contract

Once you have BNB in your wallet, run:

```bash
cd contract
npx hardhat run scripts/deploy-bsc.js --network bscTestnet
```

## Step 3: Update Contract Address

After deployment, you'll get an address like `0x123...abc`. Update the contracts.json file:

1. Copy the deployed contract address
2. Replace "TBD" in `/app/src/config/contracts.json` under `bscTestnet.contracts.MetaTalesNFT.address`

## Step 4: Test Minting

1. Go to http://localhost:3000/mint
2. Make sure you're connected to BSC Testnet in MetaMask
3. Try minting an NFT

## Alternative Networks (if BSC doesn't work)

If you want to test on other networks first:

### Mumbai (Polygon) - Usually the easiest:
- **Faucet**: https://faucet.polygon.technology/
- **Deploy**: `npx hardhat run scripts/deploy-mumbai.js --network mumbai`
- **Free MATIC**, very fast, reliable faucets

### Goerli (Ethereum) - Most stable:
- **Faucet**: https://goerlifaucet.com/
- **Deploy**: `npx hardhat run scripts/deploy-goerli.js --network goerli`
- **Free ETH**, stable, well-supported

---

**Note**: The frontend is now properly configured to recognize BSC Testnet and all other networks. The "Network Status: Unknown" issue is fixed! 🎉