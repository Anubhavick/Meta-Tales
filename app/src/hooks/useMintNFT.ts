'use client'

import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from 'wagmi'
import { sepolia, hardhat } from 'wagmi/chains'
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
  if (chainId === sepolia.id) {
    const address = process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS || ''
    // Check if it's a valid address (not the placeholder)
    if (!address || address === 'your_sepolia_contract_address_here' || !address.startsWith('0x')) {
      return ''
    }
    return address
  } else if (chainId === hardhat.id) {
    return contractsConfig.networks.localhost.contracts.MetaTalesNFT.address
  }
  return ''
}

// Check if chain is supported and has a deployed contract
const isSupportedChain = (chainId: number): boolean => {
  return chainId === sepolia.id || chainId === hardhat.id
}

// Check if contract is available for current chain
const hasValidContract = (chainId: number): boolean => {
  const address = getContractAddress(chainId)
  return !!address && address.startsWith('0x') && address.length === 42
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

  // Switch to Sepolia if not on supported network
  const ensureCorrectNetwork = async (): Promise<boolean> => {
    if (!isSupportedChain(chainId)) {
      try {
        console.log(`🔄 Switching to Sepolia testnet...`)
        await switchChain({ chainId: sepolia.id })
        return true
      } catch (error) {
        console.error('❌ Failed to switch network:', error)
        throw new Error('Please switch to Sepolia testnet in your wallet')
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
        if (chainId === sepolia.id) {
          throw new Error('Contract not yet deployed to Sepolia. Please deploy the contract first.')
        } else {
          throw new Error(`Contract not available on this network`)
        }
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
    currentChain: chainId === sepolia.id ? 'Sepolia' : chainId === hardhat.id ? 'Hardhat' : 'Unknown'
  }
}