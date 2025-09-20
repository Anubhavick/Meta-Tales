'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
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

export function useMintNFT() {
  const { address, isConnected } = useAccount()
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const [isLoading, setIsLoading] = useState(false)

  const uploadToIPFS = async (file: File): Promise<string> => {
    // For now, we'll use a simple data URL approach
    // In production, you'd want to use a proper IPFS service like web3.storage or pinata
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  const mintNFT = async (options: MintOptions): Promise<MintResult> => {
    try {
      setIsLoading(true)

      // Check if wallet is connected
      if (!isConnected || !address) {
        throw new Error('Please connect your wallet to mint NFTs')
      }

      // Check if we're on the correct network (Hardhat localhost)
      const expectedChainId = 31337 // Hardhat localhost
      
      // Try to switch to Hardhat network if not already on it
      try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
        })
      } catch (switchError: any) {
        // If network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${expectedChainId.toString(16)}`,
              chainName: 'Hardhat Localhost',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['http://127.0.0.1:8545'],
            }],
          })
        } else {
          throw new Error('Please switch to Hardhat Localhost network')
        }
      }

      // Upload cover image to IPFS (or create data URL)
      let imageUrl = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      if (options.coverImage) {
        imageUrl = await uploadToIPFS(options.coverImage)
      }

      // Upload content file to IPFS (or create data URL)
      let contentUrl = ''
      if (options.content) {
        contentUrl = await uploadToIPFS(options.content)
      }

      // Create metadata object
      const metadata = {
        name: options.title,
        description: options.description,
        image: imageUrl,
        attributes: [
          {
            trait_type: 'Content Type',
            value: options.contentType
          },
          {
            trait_type: 'Creator',
            value: address
          },
          {
            trait_type: 'Royalty Percentage',
            value: options.royaltyPercentage
          }
        ],
        properties: {
          contentType: options.contentType,
          contentUrl: contentUrl,
          creator: address
        }
      }

      // Create metadata URI (using base64 encoding for now)
      const metadataJson = JSON.stringify(metadata)
      const metadataURI = `data:application/json;base64,${btoa(metadataJson)}`

      // Convert royalty percentage to basis points (percentage * 100)
      const royaltyBasisPoints = options.royaltyPercentage * 100

      console.log('Minting NFT with params:', {
        to: options.recipientAddress || address,
        uri: metadataURI.substring(0, 50) + '...',
        royaltyRecipient: address,
        royaltyBasisPoints
      })

      // Get contract address
      const contractAddress = contractsConfig.networks.localhost.contracts.MetaTalesNFT.address

      // Use Wagmi's writeContract
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: MetaTalesNFT_ABI,
        functionName: 'mintNFT',
        args: [
          (options.recipientAddress || address) as `0x${string}`,
          metadataURI,
          address as `0x${string}`,
          BigInt(royaltyBasisPoints)
        ]
      })

      // Return immediately - the actual result will be handled by the transaction receipt hook
      return {
        success: true,
        txHash: hash || 'pending'
      }

    } catch (error: any) {
      console.error('Minting error:', error)
      return {
        success: false,
        error: error.message || 'Failed to mint NFT'
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mintNFT,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    hash,
    error: error?.message
  }
}