'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ethers } from 'ethers'
import { sepolia, hardhat } from 'wagmi/chains'
import contractsConfig from '@/config/contracts.json'

// Contract ABI (minimal - just what we need)
const MetaTalesNFT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address, uint256)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'
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
  txHash?: string
  lastSale?: {
    price: string
    date: string
  }
}

// Get contract address for current chain (prioritize Hardhat for development)
const getContractAddress = (chainId: number): string => {
  if (chainId === hardhat.id) {
    return contractsConfig.networks.localhost.contracts.MetaTalesNFT.address
  } else if (chainId === sepolia.id) {
    const address = process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS || ''
    // Check if it's a valid address (not the placeholder)
    if (!address || address === 'your_sepolia_contract_address_here' || !address.startsWith('0x')) {
      return ''
    }
    return address
  }
  return ''
}

// Check if contract is available for current chain
const hasValidContract = (chainId: number): boolean => {
  const address = getContractAddress(chainId)
  return !!address && address.startsWith('0x') && address.length === 42
}

// Get RPC URL for current chain (prioritize Hardhat)
const getRpcUrl = (chainId: number): string => {
  if (chainId === hardhat.id) {
    return 'http://127.0.0.1:8545'
  } else if (chainId === sepolia.id) {
    return `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
  }
  return ''
}

export function useUserNFTs() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Manual refresh function
  const refreshNFTs = () => {
    console.log('🔄 Manually refreshing NFTs...')
    setRefreshTrigger(prev => prev + 1)
  }

  // Parse metadata from IPFS
  const parseMetadata = async (tokenURI: string): Promise<Partial<UserNFT>> => {
    try {
      // Convert IPFS URI to HTTP gateway if needed
      const metadataUrl = tokenURI.startsWith('ipfs://') 
        ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
        : tokenURI

      console.log('📥 Fetching metadata from:', metadataUrl)
      const response = await fetch(metadataUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`)
      }
      
      const metadata = await response.json()
      
      // Convert image IPFS URI to HTTP gateway
      const coverImage = metadata.image?.startsWith('ipfs://') 
        ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
        : metadata.image || '/placeholder-nft.png'

      // Extract content type from attributes
      const contentTypeAttr = metadata.attributes?.find(
        (attr: any) => attr.trait_type === 'Content Type'
      )
      const royaltyAttr = metadata.attributes?.find(
        (attr: any) => attr.trait_type === 'Royalty Percentage'
      )

      return {
        title: metadata.name || 'Untitled',
        description: metadata.description || '',
        contentType: contentTypeAttr?.value || 'story',
        coverImage,
        royaltyPercentage: royaltyAttr?.value || 0,
        createdAt: new Date().toISOString() // We don't have creation date from metadata
      }
    } catch (error) {
      console.error('❌ Error parsing metadata:', error)
      return {
        title: 'Error Loading NFT',
        description: 'Failed to load metadata',
        contentType: 'story',
        coverImage: '/placeholder-nft.png',
        royaltyPercentage: 0
      }
    }
  }

  // Fetch NFTs for the current user
  useEffect(() => {
    async function fetchNFTs() {
      if (!isConnected || !address) {
        setUserNFTs([])
        setLoading(false)
        return
      }

      // Check if we have a valid contract for this chain
      if (!hasValidContract(chainId)) {
        setUserNFTs([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      
      try {
        // Wait a moment to ensure contracts are loaded
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const contractAddress = getContractAddress(chainId)
        if (!contractAddress) {
          console.log('No contract address for chain:', chainId)
          setUserNFTs([])
          setLoading(false)
          return
        }

        const rpcUrl = getRpcUrl(chainId)
        if (!rpcUrl) {
          console.log('No RPC URL for chain:', chainId)
          setUserNFTs([])
          setLoading(false)
          return
        }

        console.log(`🔍 Fetching NFTs for ${address} on chain ${chainId}...`)
        
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        const contract = new ethers.Contract(contractAddress, MetaTalesNFT_ABI, provider)

        // Get user's NFT balance
        const balance = await contract.balanceOf(address)
        console.log(`📊 User has ${balance.toString()} NFTs`)

        if (Number(balance) === 0) {
          setUserNFTs([])
          setLoading(false)
          return
        }

        // Get all token IDs owned by user
        const nfts: UserNFT[] = []
        for (let i = 0; i < Number(balance); i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i)
            const tokenURI = await contract.tokenURI(tokenId)
            
            console.log(`🎨 Processing NFT ${tokenId.toString()}...`)
            
            const metadata = await parseMetadata(tokenURI)
            
            nfts.push({
              id: tokenId.toString(),
              tokenId: tokenId.toString(),
              title: metadata.title || `NFT #${tokenId.toString()}`,
              description: metadata.description || 'No description available',
              contentType: metadata.contentType || 'story',
              coverImage: metadata.coverImage || '/placeholder-nft.png',
              isForSale: false, // TODO: Check marketplace contract
              royaltyPercentage: metadata.royaltyPercentage || 0,
              totalEarnings: '0', // TODO: Calculate from sales
              views: 0, // TODO: Track views
              likes: 0, // TODO: Track likes
              createdAt: new Date().toISOString(), // TODO: Get from blockchain
              txHash: undefined // TODO: Get mint transaction
            })
          } catch (error) {
            console.error(`❌ Error processing NFT at index ${i}:`, error)
          }
        }

        console.log(`✅ Successfully fetched ${nfts.length} NFTs`)
        setUserNFTs(nfts)
        
      } catch (error) {
        console.error('❌ Error fetching NFTs:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch NFTs')
      } finally {
        setLoading(false)
      }
    }

    fetchNFTs()
  }, [isConnected, address, chainId, refreshTrigger])

  // Listen for new NFT transfers to this address
  useEffect(() => {
    if (!isConnected || !address) return

    const contractAddress = getContractAddress(chainId)
    if (!contractAddress) return

    const rpcUrl = getRpcUrl(chainId)
    if (!rpcUrl) return

    let provider: ethers.JsonRpcProvider
    let contract: ethers.Contract

    try {
      provider = new ethers.JsonRpcProvider(rpcUrl)
      contract = new ethers.Contract(contractAddress, MetaTalesNFT_ABI, provider)

      // Listen for Transfer events where 'to' is the current user
      const transferFilter = contract.filters.Transfer(null, address)
      
      const handleTransfer = (from: string, to: string, tokenId: bigint) => {
        if (to.toLowerCase() === address.toLowerCase()) {
          console.log('🔔 New NFT received! Refreshing list...')
          setTimeout(() => refreshNFTs(), 2000) // Small delay to ensure blockchain state is updated
        }
      }

      contract.on(transferFilter, handleTransfer)

      return () => {
        contract.off(transferFilter, handleTransfer)
      }
    } catch (error) {
      console.error('❌ Error setting up event listener:', error)
    }
  }, [address, isConnected, chainId])

  return {
    userNFTs,
    loading,
    error,
    refreshNFTs,
    isEmpty: userNFTs.length === 0 && !loading,
    hasContract: hasValidContract(chainId),
    currentNetwork: chainId === hardhat.id ? 'Hardhat' : chainId === sepolia.id ? 'Sepolia' : 'Unknown'
  }
}