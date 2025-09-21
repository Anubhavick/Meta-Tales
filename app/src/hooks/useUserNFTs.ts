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
  'function exists(uint256 tokenId) view returns (bool)',
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

// Get contract address for current chain (prioritize environment variables)
const getContractAddress = (chainId: number): string => {
  console.log('Getting contract address for chainId:', chainId)
  
  if (chainId === hardhat.id) {
    // Check environment variable first, then fallback to config
    const envAddress = process.env.NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS
    if (envAddress && envAddress.startsWith('0x') && envAddress.length === 42) {
      console.log('Using Hardhat contract address from env:', envAddress)
      return envAddress
    }
    const configAddress = contractsConfig.networks.localhost.contracts.MetaTalesNFT.address
    console.log('Using Hardhat contract address from config:', configAddress)
    return configAddress
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

        // Get user's NFT balance first to check if they have any
        const balance = await contract.balanceOf(address)
        console.log(`📊 User has ${balance.toString()} NFTs`)

        if (Number(balance) === 0) {
          // Show demo data when no NFTs exist
          const demoNFTs: UserNFT[] = [
            {
              id: 'demo-1',
              title: 'The Enchanted Forest',
              description: 'A mystical tale of adventure and magic where a young explorer discovers a hidden realm filled with talking animals and ancient secrets.',
              contentType: 'story',
              coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop',
              tokenId: 'demo-1',
              isForSale: true,
              price: '0.1',
              royaltyPercentage: 5,
              totalEarnings: '0.025',
              views: 1247,
              likes: 89,
              createdAt: '2025-09-15T10:30:00Z',
              lastSale: {
                price: '0.08',
                date: '2025-09-18T14:22:00Z'
              }
            },
            {
              id: 'demo-2',
              title: 'Whispers of Tomorrow',
              description: 'A thought-provoking poem about hope, dreams, and the endless possibilities that each new day brings to our lives.',
              contentType: 'poem',
              coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
              tokenId: 'demo-2',
              isForSale: false,
              royaltyPercentage: 7.5,
              totalEarnings: '0.15',
              views: 892,
              likes: 156,
              createdAt: '2025-09-12T16:45:00Z'
            },
            {
              id: 'demo-3',
              title: 'Chronicles of the Digital Age',
              description: 'An epic comic series exploring the intersection of technology and humanity in a dystopian future where AI and humans coexist.',
              contentType: 'comic',
              coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
              tokenId: 'demo-3',
              isForSale: true,
              price: '0.25',
              royaltyPercentage: 10,
              totalEarnings: '0.3',
              views: 2156,
              likes: 234,
              createdAt: '2025-09-08T09:15:00Z',
              lastSale: {
                price: '0.2',
                date: '2025-09-19T11:30:00Z'
              }
            },
            {
              id: 'demo-4',
              title: 'Midnight Reflections',
              description: 'A collection of intimate short stories exploring love, loss, and the quiet moments that define our human experience.',
              contentType: 'story',
              coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
              tokenId: 'demo-4',
              isForSale: false,
              royaltyPercentage: 6,
              totalEarnings: '0.08',
              views: 678,
              likes: 92,
              createdAt: '2025-09-20T20:12:00Z'
            }
          ]
          setUserNFTs(demoNFTs)
          setLoading(false)
          return
        }

        // Get total supply to know how many tokens exist
        const totalSupply = await contract.totalSupply()
        console.log(`📊 Total supply: ${totalSupply.toString()}`)

        // Since we don't have enumeration, we'll check each token ID from 1 to totalSupply
        const nfts: UserNFT[] = []
        
        for (let tokenId = 1; tokenId <= Number(totalSupply); tokenId++) {
          try {
            // Check if token exists and who owns it
            const tokenExists = await contract.exists(tokenId)
            if (!tokenExists) continue

            const owner = await contract.ownerOf(tokenId)
            
            // If this user owns this token, fetch its metadata
            if (owner.toLowerCase() === address.toLowerCase()) {
              console.log(`🎨 User owns NFT #${tokenId}, fetching metadata...`)
              
              const tokenURI = await contract.tokenURI(tokenId)
              const metadata = await parseMetadata(tokenURI)
              
              nfts.push({
                id: tokenId.toString(),
                tokenId: tokenId.toString(),
                title: metadata.title || `NFT #${tokenId}`,
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
            }
          } catch (error) {
            console.error(`❌ Error processing token ID ${tokenId}:`, error)
            // Continue to next token
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