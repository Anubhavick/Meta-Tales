'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { sepolia, hardhat, goerli, polygonMumbai, optimismGoerli, arbitrumGoerli, bscTestnet } from 'wagmi/chains'
import contractsConfig from '@/config/contracts.json'

// Add window.ethereum type
declare global {
  interface Window {
    ethereum?: any
  }
}

const MetaTalesNFT_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "uri", "type": "string"},
      {"internalType": "address", "name": "royaltyRecipient", "type": "address"},
      {"internalType": "uint96", "name": "royaltyFraction", "type": "uint96"}
    ],
    "name": "mintNFT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

interface MintOptions {
  title: string
  description: string
  contentType: 'story' | 'poem' | 'comic'
  content: File | null
  coverImage: File | null
  royaltyPercentage: number
  recipientAddress: string
}

interface MintResult {
  success: boolean
  tokenId?: string
  txHash?: string
  error?: string
}

// Get contract address for current chain
const getContractAddress = (chainId: number): string => {
  console.log('Getting contract address for chainId:', chainId)
  
  switch (chainId) {
    case hardhat.id: // 31337
      return contractsConfig.networks.localhost.contracts.MetaTalesNFT.address
    case sepolia.id: // 11155111
      const sepoliaAddress = process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS || contractsConfig.networks.sepolia.contracts.MetaTalesNFT.address
      return sepoliaAddress === 'TBD' ? '' : sepoliaAddress
    case goerli.id: // 5
      const goerliAddress = contractsConfig.networks.goerli.contracts.MetaTalesNFT.address
      return goerliAddress === 'TBD' ? '' : goerliAddress
    case polygonMumbai.id: // 80001
      const mumbaiAddress = contractsConfig.networks.mumbai.contracts.MetaTalesNFT.address
      return mumbaiAddress === 'TBD' ? '' : mumbaiAddress
    case optimismGoerli.id: // 420
      const optimismAddress = contractsConfig.networks.optimismGoerli.contracts.MetaTalesNFT.address
      return optimismAddress === 'TBD' ? '' : optimismAddress
    case arbitrumGoerli.id: // 421613
      const arbitrumAddress = contractsConfig.networks.arbitrumGoerli.contracts.MetaTalesNFT.address
      return arbitrumAddress === 'TBD' ? '' : arbitrumAddress
    case bscTestnet.id: // 97
      const bscAddress = contractsConfig.networks.bscTestnet.contracts.MetaTalesNFT.address
      return bscAddress === 'TBD' ? '' : bscAddress
    default:
      return ''
  }
}

// Check if chain is supported
const isSupportedChain = (chainId: number): boolean => {
  const supportedChains: number[] = [
    hardhat.id,      // 31337
    sepolia.id,      // 11155111  
    goerli.id,       // 5
    polygonMumbai.id, // 80001
    optimismGoerli.id, // 420
    arbitrumGoerli.id, // 421613
    bscTestnet.id    // 97
  ]
  return supportedChains.includes(chainId)
}

// Check if contract is available for current chain
const hasValidContract = (chainId: number): boolean => {
  const address = getContractAddress(chainId)
  return !!address && address.startsWith('0x') && address.length === 42
}

// Get network name for display
const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case hardhat.id: return 'Hardhat'
    case sepolia.id: return 'Sepolia'
    case goerli.id: return 'Goerli'
    case polygonMumbai.id: return 'Mumbai'
    case optimismGoerli.id: return 'Optimism Goerli'
    case arbitrumGoerli.id: return 'Arbitrum Goerli'
    case bscTestnet.id: return 'BSC Testnet'
    default: return 'Unknown'
  }
}

export function useMintNFT() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const [isLoading, setIsLoading] = useState(false)

  // Upload to IPFS using our API route
  const uploadToIPFS = async (formData: MintOptions): Promise<string> => {
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('contentType', formData.contentType)
    data.append('royaltyPercentage', formData.royaltyPercentage.toString())
    
    if (formData.coverImage) {
      data.append('image', formData.coverImage)
    }
    
    if (formData.content) {
      data.append('content', formData.content)
    }

    console.log('📦 Uploading to IPFS via API...')
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to upload to IPFS')
    }

    const result = await response.json()
    console.log('✅ IPFS upload successful:', result.metadataUrl)
    return result.metadataUrl
  }

  // Switch to supported network (prioritize Hardhat for development)
  const ensureCorrectNetwork = async (): Promise<boolean> => {
    if (!isSupportedChain(chainId)) {
      try {
        console.log(`🔄 Switching to Hardhat localhost...`)
        await switchChain({ chainId: hardhat.id })
        return true
      } catch (error) {
        console.log(`❌ Failed to switch to Hardhat, trying other networks...`)
        // Try other networks in priority order
        const fallbackChains = [goerli.id, polygonMumbai.id, sepolia.id]
        for (const targetChainId of fallbackChains) {
          try {
            await switchChain({ chainId: targetChainId })
            return true
          } catch (chainError) {
            console.log(`❌ Failed to switch to chain ${targetChainId}`)
          }
        }
        console.error('❌ Failed to switch to any supported network')
        return false
      }
    }
    return true
  }

  const mintNFT = async (formData: MintOptions): Promise<MintResult> => {
    try {
      if (!isConnected || !address) {
        throw new Error('Wallet not connected')
      }

      console.log('🎯 Starting NFT minting process...')
      setIsLoading(true)

      // 1. Ensure we're on the correct network
      await ensureCorrectNetwork()

      // 2. Upload to IPFS
      const metadataUrl = await uploadToIPFS(formData)

      // 3. Check if contract is available
      if (!hasValidContract(chainId)) {
        const networkName = getNetworkName(chainId)
        throw new Error(`Contract not yet deployed to ${networkName}. Please deploy the contract first or switch to a network with a deployed contract.`)
      }

      // 4. Get contract address for current chain
      const contractAddress = getContractAddress(chainId)
      console.log(`📄 Contract address: ${contractAddress}`)
      console.log(`🔗 Metadata URL: ${metadataUrl}`)

      // 5. Calculate royalty fraction (basis points: 10000 = 100%)
      const royaltyFraction = Math.floor(formData.royaltyPercentage * 100)

      // 6. Mint the NFT
      console.log('⛏️ Minting NFT on blockchain...')
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: MetaTalesNFT_ABI,
        functionName: 'mintNFT',
        args: [
          formData.recipientAddress as `0x${string}`,
          metadataUrl,
          formData.recipientAddress as `0x${string}`,
          BigInt(royaltyFraction)
        ],
      })

      return {
        success: true,
        txHash: hash
      }

    } catch (error) {
      console.error('❌ Minting failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setIsLoading(false)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  // Reset loading when transaction is complete
  useEffect(() => {
    if (isSuccess || error) {
      setIsLoading(false)
    }
  }, [isSuccess, error])

  return {
    mintNFT,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    hash,
    error: error?.message,
    isSupportedChain: isSupportedChain(chainId),
    hasValidContract: hasValidContract(chainId),
    currentChain: getNetworkName(chainId)
  }
}