'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ethers } from 'ethers'
import { hardhat } from 'wagmi/chains'
import contractsConfig from '@/config/contracts.json'

export interface TransactionHistory {
  hash: string
  type: 'mint' | 'transfer' | 'approval'
  from: string
  to: string
  tokenId?: string
  timestamp: number
  status: 'success' | 'pending' | 'failed'
  value?: string
  gasUsed?: string
  blockNumber?: number
}

export interface UserActivity {
  totalTransactions: number
  totalMinted: number
  totalReceived: number
  totalSent: number
  recentActivity: TransactionHistory[]
  totalGasSpent: string
}

// Get contract address for current chain (focused on Hardhat)
const getContractAddress = (chainId: number): string => {
  if (chainId === hardhat.id) {
    return contractsConfig.networks.localhost.contracts.MetaTalesNFT.address
  }
  return ''
}

export function useMetaMaskHistory() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [userActivity, setUserActivity] = useState<UserActivity>({
    totalTransactions: 0,
    totalMinted: 0,
    totalReceived: 0,
    totalSent: 0,
    recentActivity: [],
    totalGasSpent: '0'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserActivity() {
      if (!isConnected || !address || chainId !== hardhat.id) {
        setUserActivity({
          totalTransactions: 0,
          totalMinted: 0,
          totalReceived: 0,
          totalSent: 0,
          recentActivity: [],
          totalGasSpent: '0'
        })
        return
      }

      setLoading(true)
      setError(null)

      try {
        const contractAddress = getContractAddress(chainId)
        if (!contractAddress) {
          console.log('No contract deployed on current network')
          setUserActivity(prev => ({ ...prev }))
          return
        }

        // Connect to local provider
        const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
        
        // Get current block number
        const currentBlock = await provider.getBlockNumber()
        
        // Fetch recent blocks (last 100 blocks or so)
        const fromBlock = Math.max(0, currentBlock - 100)
        
        // NFT Contract ABI for events
        const MetaTalesNFT_ABI = [
          'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
          'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
          'function balanceOf(address owner) view returns (uint256)',
          'function tokenURI(uint256 tokenId) view returns (string)'
        ]
        
        const contract = new ethers.Contract(contractAddress, MetaTalesNFT_ABI, provider)
        
        // Get Transfer events involving this user
        const transferToFilter = contract.filters.Transfer(null, address)
        const transferFromFilter = contract.filters.Transfer(address, null)
        const approvalFilter = contract.filters.Approval(address, null)
        
        const [transfersTo, transfersFrom, approvals] = await Promise.all([
          contract.queryFilter(transferToFilter, fromBlock, currentBlock),
          contract.queryFilter(transferFromFilter, fromBlock, currentBlock),
          contract.queryFilter(approvalFilter, fromBlock, currentBlock)
        ])

        // Process events into transaction history
        const allEvents = [...transfersTo, ...transfersFrom, ...approvals]
        const recentActivity: TransactionHistory[] = []
        
        let totalMinted = 0
        let totalReceived = 0
        let totalSent = 0
        let totalGasSpent = BigInt(0)

        for (const event of allEvents) {
          if (!event.blockNumber) continue
          
          const block = await provider.getBlock(event.blockNumber)
          const receipt = await provider.getTransactionReceipt(event.transactionHash)
          
          if (!block || !receipt) continue

          // Calculate gas spent
          if (receipt.from.toLowerCase() === address.toLowerCase()) {
            totalGasSpent += receipt.gasUsed * receipt.gasPrice
          }

          // Parse event based on topics
          try {
            const parsedLog = contract.interface.parseLog({
              topics: event.topics,
              data: event.data
            })

            if (!parsedLog) continue

            if (parsedLog.name === 'Transfer') {
              const from = parsedLog.args[0]
              const to = parsedLog.args[1]
              const tokenId = parsedLog.args[2].toString()

              let type: 'mint' | 'transfer' = 'transfer'
              
              // Check if it's a mint (from zero address)
              if (from === '0x0000000000000000000000000000000000000000') {
                type = 'mint'
                if (to.toLowerCase() === address.toLowerCase()) {
                  totalMinted++
                }
              } else if (to.toLowerCase() === address.toLowerCase()) {
                totalReceived++
              } else if (from.toLowerCase() === address.toLowerCase()) {
                totalSent++
              }

              recentActivity.push({
                hash: event.transactionHash,
                type,
                from,
                to,
                tokenId,
                timestamp: block.timestamp * 1000,
                status: receipt.status === 1 ? 'success' : 'failed',
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: event.blockNumber
              })
            } else if (parsedLog.name === 'Approval') {
              recentActivity.push({
                hash: event.transactionHash,
                type: 'approval',
                from: parsedLog.args[0],
                to: parsedLog.args[1],
                tokenId: parsedLog.args[2].toString(),
                timestamp: block.timestamp * 1000,
                status: receipt.status === 1 ? 'success' : 'failed',
                gasUsed: receipt.gasUsed.toString(),
                blockNumber: event.blockNumber
              })
            }
          } catch (parseError) {
            console.warn('Failed to parse event:', parseError)
            continue
          }
        }

        // Sort by timestamp (newest first)
        recentActivity.sort((a, b) => b.timestamp - a.timestamp)

        setUserActivity({
          totalTransactions: allEvents.length,
          totalMinted,
          totalReceived,
          totalSent,
          recentActivity: recentActivity.slice(0, 20), // Show last 20 activities
          totalGasSpent: ethers.formatEther(totalGasSpent)
        })

      } catch (error) {
        console.error('Error fetching user activity:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch activity')
      } finally {
        setLoading(false)
      }
    }

    fetchUserActivity()
  }, [isConnected, address, chainId])

  const refreshActivity = () => {
    if (isConnected && address && chainId === hardhat.id) {
      setUserActivity(prev => ({ ...prev }))
      // Re-trigger the effect
      setLoading(true)
    }
  }

  return {
    userActivity,
    loading,
    error,
    refreshActivity,
    isHardhatNetwork: chainId === hardhat.id,
    hasContract: !!getContractAddress(chainId)
  }
}