'use client'

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { sepolia, hardhat } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
  appName: 'Meta-Tales',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '9e510ffa7849970129757b973e412882',
  chains: [sepolia, hardhat], // Sepolia first as primary network
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