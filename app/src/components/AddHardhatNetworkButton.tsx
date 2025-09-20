'use client'

import { useState } from 'react'
import { addHardhatNetwork, switchToHardhatNetwork, HARDHAT_NETWORK_DETAILS } from '@/utils/addHardhatNetwork'

export function AddHardhatNetworkButton() {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddNetwork = async () => {
    setIsAdding(true)
    try {
      const success = await addHardhatNetwork()
      if (success) {
        // Optionally switch to the network after adding
        await switchToHardhatNetwork()
      }
    } catch (error) {
      console.error('Error adding Hardhat network:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Add Hardhat Network to MetaMask</h3>
      
      <div className="mb-4 text-sm text-gray-600">
        <p><strong>Network Name:</strong> {HARDHAT_NETWORK_DETAILS.networkName}</p>
        <p><strong>RPC URL:</strong> {HARDHAT_NETWORK_DETAILS.rpcUrl}</p>
        <p><strong>Chain ID:</strong> {HARDHAT_NETWORK_DETAILS.chainId}</p>
        <p><strong>Currency Symbol:</strong> {HARDHAT_NETWORK_DETAILS.currencySymbol}</p>
      </div>

      <button
        onClick={handleAddNetwork}
        disabled={isAdding}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? 'Adding Network...' : 'Add to MetaMask'}
      </button>

      <div className="mt-3 text-xs text-gray-500">
        <p>💡 Make sure your Hardhat node is running on http://127.0.0.1:8545</p>
      </div>
    </div>
  )
}