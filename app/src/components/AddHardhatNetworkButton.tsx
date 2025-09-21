'use client'

import { useState } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { addHardhatNetwork, switchToHardhatNetwork, HARDHAT_NETWORK_DETAILS } from '@/utils/addHardhatNetwork'

export function AddHardhatNetworkButton() {
  const [isAdding, setIsAdding] = useState(false)
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const isOnHardhat = chainId === hardhat.id

  const handleNetworkAction = async () => {
    setIsAdding(true)
    try {
      if (isOnHardhat) {
        
        return
      }


      try {
        await switchChain({ chainId: hardhat.id })
      } catch (error) {
        
        console.log('Wagmi switch failed, trying manual add...')
        const success = await addHardhatNetwork()
        if (success) {
          await switchToHardhatNetwork()
        }
      }
    } catch (error) {
      console.error('Error with Hardhat network:', error)
    } finally {
      setIsAdding(false)
    }
  }

  if (isOnHardhat) {
    return (
      <div className="p-4 border border-green-200 rounded-lg bg-green-50">
        <h3 className="text-lg font-semibold mb-2 text-green-800">✅ Connected to Hardhat Network</h3>
        <div className="mb-4 text-sm text-green-700">
          <p><strong>Network Name:</strong> {HARDHAT_NETWORK_DETAILS.networkName}</p>
          <p><strong>Chain ID:</strong> {HARDHAT_NETWORK_DETAILS.chainId}</p>
          <p><strong>RPC URL:</strong> {HARDHAT_NETWORK_DETAILS.rpcUrl}</p>
        </div>
        <div className="text-xs text-green-600">
          <p>🎉 Perfect! You're ready to mint and manage NFTs on the local network.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
      <h3 className="text-lg font-semibold mb-2 text-orange-800">Switch to Hardhat Network</h3>
      
      <div className="mb-4 text-sm text-orange-700">
        <p><strong>Network Name:</strong> {HARDHAT_NETWORK_DETAILS.networkName}</p>
        <p><strong>RPC URL:</strong> {HARDHAT_NETWORK_DETAILS.rpcUrl}</p>
        <p><strong>Chain ID:</strong> {HARDHAT_NETWORK_DETAILS.chainId}</p>
        <p><strong>Currency Symbol:</strong> {HARDHAT_NETWORK_DETAILS.currencySymbol}</p>
      </div>

      <button
        onClick={handleNetworkAction}
        disabled={isAdding}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
      >
        {isAdding ? 'Switching Network...' : 'Switch to Hardhat Network'}
      </button>

      <div className="text-xs text-orange-600">
        <p>💡 Make sure your Hardhat node is running on http://127.0.0.1:8545</p>
        <p>🔧 This gives you access to test accounts with 10,000 ETH each!</p>
      </div>
    </div>
  )
}