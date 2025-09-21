'use client'

import { getDefaultConfig, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { hardhat, sepolia, polygonMumbai, bscTestnet } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import '@rainbow-me/rainbowkit/styles.css'
import { useEffect } from 'react'

// Define Polygon Amoy testnet (new Polygon testnet)
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
}

const config = getDefaultConfig({
  appName: 'Meta-Tales',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '9e510ffa7849970129757b973e412882',
  chains: [
    hardhat,
    sepolia,
    polygonMumbai,
    polygonAmoy,
    bscTestnet
  ],
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

function SessionCleaner() {
  useEffect(() => {
    // Clear any stale WalletConnect sessions on mount
    if (typeof window !== 'undefined') {
      try {
        // Clear localStorage entries related to WalletConnect
        const keysToRemove = Object.keys(localStorage).filter(key => 
          key.includes('wc@2') || 
          key.includes('walletconnect') || 
          key.includes('wagmi')
        )
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key)
          } catch (e) {
            // Ignore errors when removing items
          }
        })

        // Suppress React DOM warnings for QR code errorCorrection prop
        const originalConsoleError = console.error
        console.error = (...args) => {
          if (args[0]?.includes?.('errorCorrection')) {
            return // Suppress the errorCorrection warning
          }
          originalConsoleError.apply(console, args)
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }, [])
  
  return null
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SessionCleaner />
        <RainbowKitProvider 
          modalSize="compact"
          showRecentTransactions={false}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}