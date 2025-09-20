'use client'

import { useWallet } from './WalletProvider'
import { Wallet, ChevronDown, LogOut } from 'lucide-react'
import { shortenAddress } from '@/lib/ethereum'
import { useState } from 'react'

export function WalletButton() {
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, error } = useWallet()
  const [showDropdown, setShowDropdown] = useState(false)

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-accent hover:bg-accent/80 px-4 py-2 rounded-lg transition-colors"
        >
          <Wallet className="h-4 w-4" />
          <span>{shortenAddress(address)}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-primary border border-white/10 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-white/10">
              <div className="text-sm text-muted">Connected Wallet</div>
              <div className="font-mono text-sm">{shortenAddress(address, 6)}</div>
            </div>
            <button
              onClick={() => {
                disconnectWallet()
                setShowDropdown(false)
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-left hover:bg-white/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
      >
        <Wallet className="h-4 w-4" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
      
      {error && (
        <div className="absolute mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}