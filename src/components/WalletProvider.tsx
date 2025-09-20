'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { WalletState } from '@/types'
import { getProvider } from '@/lib/ethereum'

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isConnecting: false,
    error: null
  })

  const connectWallet = async () => {
    if (typeof window === 'undefined') return

    try {
      setWalletState(prev => ({ ...prev, isConnecting: true, error: null }))

      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      const provider = await getProvider()
      if (!provider) {
        throw new Error('Failed to get provider')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      }) as string[]

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)

      setWalletState({
        address,
        chainId,
        isConnected: true,
        isConnecting: false,
        error: null
      })

      // Store connection state
      localStorage.setItem('walletConnected', 'true')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      setWalletState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      }))
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      chainId: null,
      isConnected: false,
      isConnecting: false,
      error: null
    })
    localStorage.removeItem('walletConnected')
  }

  // Auto-connect on page load if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window === 'undefined') return
      
      const wasConnected = localStorage.getItem('walletConnected')
      if (!wasConnected || !window.ethereum) return

      try {
        const provider = await getProvider()
        if (!provider) return

        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        }) as string[]

        if (accounts.length > 0) {
          const address = accounts[0]
          const network = await provider.getNetwork()
          const chainId = Number(network.chainId)

          setWalletState({
            address,
            chainId,
            isConnected: true,
            isConnecting: false,
            error: null
          })
        }
      } catch (error) {
        console.error('Auto-connect failed:', error)
        localStorage.removeItem('walletConnected')
      }
    }

    autoConnect()
  }, [])

  // Listen for account and network changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const handleAccountsChanged = (data: unknown) => {
      const accounts = data as string[]
      if (accounts.length === 0) {
        disconnectWallet()
      } else {
        setWalletState(prev => ({
          ...prev,
          address: accounts[0]
        }))
      }
    }

    const handleChainChanged = (data: unknown) => {
      const chainId = data as string
      setWalletState(prev => ({
        ...prev,
        chainId: parseInt(chainId, 16)
      }))
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connectWallet,
        disconnectWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Add type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (params: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (data: unknown) => void) => void
      removeListener: (event: string, callback: (data: unknown) => void) => void
    }
  }
}