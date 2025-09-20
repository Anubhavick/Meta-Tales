'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import contractsConfig from '@/config/contracts.json'

// Contract ABI (minimal - just what we need)
const MetaTalesNFT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address, uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)'
]

export interface UserNFT {
  id: string
  title: string
  description: string
  contentType: 'story' | 'poem' | 'comic'
  coverImage: string
  tokenId: string
  isForSale: boolean
  price?: string
  royaltyPercentage: number
  totalEarnings: string
  views: number
  likes: number
  createdAt: string
  lastSale?: {
    price: string
    date: string
  }
}

export function useUserNFTs() {
  const { address, isConnected } = useAccount()
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Get contract address from config
  const contractAddress = contractsConfig.networks.localhost.contracts.MetaTalesNFT.address

  // Manual refresh function
  const refreshNFTs = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    async function fetchUserNFTs() {
      if (!address || !isConnected) {
        setUserNFTs([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Create provider to read contract data directly
        const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545')
        const contract = new ethers.Contract(contractAddress, MetaTalesNFT_ABI, provider)

        // Get user's NFT balance
        const balance = await contract.balanceOf(address)
        const nftCount = Number(balance)
        
        if (nftCount === 0) {
          setUserNFTs([])
          setLoading(false)
          return
        }

        // Since we don't have enumerable, we need to check all token IDs
        // Start by getting total supply to know the range
        let totalSupply = 0
        try {
          totalSupply = Number(await contract.totalSupply())
        } catch (e) {
          // If totalSupply is not available, we'll check a reasonable range
          totalSupply = 100 // Check first 100 tokens
        }

        const userTokenIds = []
        
        // Check each token ID to see if the user owns it
        for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
          try {
            const owner = await contract.ownerOf(tokenId)
            if (owner.toLowerCase() === address.toLowerCase()) {
              userTokenIds.push(tokenId)
            }
          } catch (e) {
            // Token doesn't exist or other error, skip
            continue
          }
        }

        // Listen for new mints to this user
        const transferFilter = contract.filters.Transfer(null, address, null)
        contract.on(transferFilter, (from, to, tokenId) => {
          console.log('New NFT received:', tokenId.toString())
          // Refresh NFTs when new one is received
          setTimeout(() => fetchUserNFTs(), 2000)
        })

        // Cleanup listener on unmount
        return () => {
          contract.removeAllListeners(transferFilter)
        }
        
        // Get metadata for each token
        const metadataPromises = userTokenIds.map(async (tokenId: number) => {
          try {
            const tokenURI = await contract.tokenURI(tokenId)
            const [royaltyRecipient, royaltyAmount] = await contract.royaltyInfo(tokenId, ethers.parseEther('1'))
            
            // Calculate royalty percentage (royaltyAmount for 1 ETH sale)
            const royaltyPercentage = Number(ethers.formatEther(royaltyAmount)) * 100

            // Try to fetch metadata from URI
            let metadata = {
              name: `Meta-Tales NFT #${tokenId}`,
              description: 'A literary NFT from Meta-Tales',
              image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }

            if (tokenURI) {
              try {
                if (tokenURI.startsWith('data:application/json;base64,')) {
                  // Handle base64 encoded JSON
                  const base64Data = tokenURI.replace('data:application/json;base64,', '')
                  const jsonString = Buffer.from(base64Data, 'base64').toString('utf-8')
                  metadata = JSON.parse(jsonString)
                } else if (tokenURI.startsWith('http') || tokenURI.startsWith('ipfs://')) {
                  // Handle URL-based metadata
                  const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'), {
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                  })
                  if (response.ok) {
                    metadata = await response.json()
                  }
                } else if (tokenURI.startsWith('data:application/json,')) {
                  // Handle plain JSON data URI
                  const jsonString = tokenURI.replace('data:application/json,', '')
                  metadata = JSON.parse(decodeURIComponent(jsonString))
                }
              } catch (e) {
                console.log('Could not fetch metadata for token', tokenId, 'URI:', tokenURI)
              }
            }

            return {
              id: tokenId.toString(),
              title: metadata.name || `Meta-Tales NFT #${tokenId}`,
              description: metadata.description || 'A literary NFT from Meta-Tales',
              contentType: 'story' as const, // Default to story
              coverImage: metadata.image || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              tokenId: tokenId.toString(),
              isForSale: false, // Default to not for sale
              royaltyPercentage: Math.round(royaltyPercentage),
              totalEarnings: '0', // Would need marketplace data
              views: 0, // Would need analytics
              likes: 0, // Would need analytics  
              createdAt: new Date().toISOString().split('T')[0], // Approximate
            } as UserNFT
          } catch (error) {
            console.error('Error fetching NFT data for token', tokenId, error)
            return null
          }
        })

        const nfts = await Promise.all(metadataPromises)
        const validNFTs = nfts.filter(nft => nft !== null) as UserNFT[]
        
        setUserNFTs(validNFTs)
        setError(null)
      } catch (err) {
        console.error('Error fetching user NFTs:', err)
        setError('Failed to load your NFTs')
        setUserNFTs([])
      } finally {
        setLoading(false)
      }
    }

    fetchUserNFTs()
  }, [address, isConnected, contractAddress, refreshTrigger])

  return {
    userNFTs,
    loading,
    error,
    refreshNFTs, // Add manual refresh function
    totalNFTs: userNFTs.length,
    totalEarnings: userNFTs.reduce((sum, nft) => sum + Number(nft.totalEarnings), 0).toString(),
    totalViews: userNFTs.reduce((sum, nft) => sum + nft.views, 0),
    totalLikes: userNFTs.reduce((sum, nft) => sum + nft.likes, 0),
  }
}