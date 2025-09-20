'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { hardhat, sepolia, goerli, polygon, polygonMumbai, optimism, optimismGoerli, arbitrum, arbitrumGoerli, bsc, bscTestnet } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'Meta-Tales',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '9e510ffa7849970129757b973e412882',
  chains: [
    hardhat,      // Local development - highest priority
    goerli,       // Most stable testnet
    polygonMumbai, // Free MATIC, fast transactions
    sepolia,      // Ethereum testnet
    optimismGoerli, // L2 testnet
    arbitrumGoerli, // L2 testnet
    bscTestnet,   // BSC testnet
    // Add mainnet options if needed
    polygon,
    optimism,
    arbitrum,
    bsc
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}