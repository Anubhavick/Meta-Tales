'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { useState, useEffect } from 'react'

export default function DebugPage() {
  const { address, isConnected, isConnecting } = useAccount()
  const chainId = useChainId()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Wallet Connection Debug</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
          <div className="space-y-2">
            <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
            <p><strong>Connecting:</strong> {isConnecting ? 'Yes' : 'No'}</p>
            <p><strong>Address:</strong> {address || 'Not connected'}</p>
            <p><strong>Chain ID:</strong> {chainId}</p>
            <p><strong>MetaMask Available:</strong> {typeof window !== 'undefined' && window.ethereum ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Connect Button</h2>
          <ConnectButton />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Manual MetaMask Test</h2>
          <button
            onClick={async () => {
              if (typeof window !== 'undefined' && window.ethereum) {
                try {
                  await window.ethereum.request({ method: 'eth_requestAccounts' })
                  console.log('MetaMask connection successful')
                } catch (error) {
                  console.error('MetaMask connection failed:', error)
                }
              } else {
                alert('MetaMask not detected')
              }
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Test Direct MetaMask Connection
          </button>
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    ethereum?: any
  }
}