'use client'

import { Navigation } from '@/components/Navigation'
import { useState } from 'react'
import { FileText, ImageIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useMintNFT } from '../../hooks/useMintNFT'
import { useAccount } from 'wagmi'

type ContentType = 'story' | 'poem' | 'comic' | ''

interface MintFormData {
  title: string
  description: string
  contentType: ContentType
  content: File | null
  coverImage: File | null
  royaltyPercentage: number
}

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const { mintNFT, isLoading, isSupportedChain, currentChain, hasValidContract } = useMintNFT()
  
  const [formData, setFormData] = useState<MintFormData>({
    title: '',
    description: '',
    contentType: '',
    content: null,
    coverImage: null,
    royaltyPercentage: 5
  })
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [tokenId, setTokenId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'content' | 'coverImage') => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      [fileType]: file
    }))
  }

  const validateForm = (): boolean => {
    return !!(
      formData.title &&
      formData.description &&
      formData.contentType &&
      formData.coverImage
    )
  }

  const handleMint = async () => {
    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet first')
      setUploadStatus('error')
      return
    }
    
    if (!validateForm()) {
      setErrorMessage('Please fill in all required fields')
      setUploadStatus('error')
      return
    }

    try {
      setUploadStatus('uploading')
      setErrorMessage('')
      setTxHash('')
      setTokenId('')

      console.log('🎯 Starting mint process...')
      const result = await mintNFT({
        title: formData.title,
        description: formData.description,
        contentType: formData.contentType as 'story' | 'poem' | 'comic',
        content: formData.content,
        coverImage: formData.coverImage,
        royaltyPercentage: formData.royaltyPercentage,
        recipientAddress: address
      })

      if (result.success) {
        setUploadStatus('success')
        setTxHash(result.txHash || '')
        setTokenId(result.tokenId || '')
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          contentType: '',
          content: null,
          coverImage: null,
          royaltyPercentage: 5
        })
      } else {
        setUploadStatus('error')
        setErrorMessage(result.error || 'Failed to mint NFT')
      }
      
    } catch (error: any) {
      console.error('❌ Minting failed:', error)
      setUploadStatus('error')
      setErrorMessage(error?.message || 'Unknown error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mint Your Literary NFT
          </h1>
          <p className="text-xl text-gray-600">
            Transform your creative work into a blockchain-verified NFT with built-in royalties
          </p>
        </div>

        {/* Success Message */}
        {uploadStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-green-800 font-semibold">NFT Minted Successfully!</h3>
                {tokenId && (
                  <p className="text-green-700">
                    Token ID: <span className="font-mono text-sm">#{tokenId}</span>
                  </p>
                )}
                {txHash && (
                  <p className="text-green-700">
                    Transaction: 
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm ml-1 underline"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-semibold">Minting Failed</h3>
                <p className="text-red-700">
                  {errorMessage || 'There was an error minting your NFT. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Wallet Not Connected</h3>
                <p className="text-yellow-700">
                  Please connect your wallet using the "Connect Wallet" button in the top right to mint NFTs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Network Status */}
        {isConnected && (
          <div className={`border rounded-lg p-4 mb-8 ${isSupportedChain ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex items-center">
              <AlertCircle className={`h-5 w-5 mr-2 ${isSupportedChain ? 'text-green-600' : 'text-orange-600'}`} />
              <div>
                <h3 className={`font-semibold ${isSupportedChain ? 'text-green-800' : 'text-orange-800'}`}>
                  Network Status: {currentChain}
                </h3>
                <p className={`${isSupportedChain ? 'text-green-700' : 'text-orange-700'}`}>
                  {isSupportedChain 
                    ? `Connected to ${currentChain}. ${hasValidContract ? 'You can mint NFTs on this network.' : 'Contract not deployed yet - please deploy first.'}`
                    : `Please switch to a supported testnet to mint NFTs. Available: Hardhat, Goerli, Mumbai, Sepolia, Optimism, Arbitrum, BSC.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mint Form */}
        <div className="bg-white rounded-lg shadow border p-8">
          <form className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the title of your literary work"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your literary work, its themes, and what makes it special"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Content Type */}
            <div>
              <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select content type</option>
                <option value="story">Story</option>
                <option value="poem">Poem</option>
                <option value="comic">Comic</option>
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="coverImage" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload cover image</span>
                      <input
                        id="coverImage"
                        name="coverImage"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, 'coverImage')}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {formData.coverImage && (
                    <p className="text-sm text-green-600">✓ {formData.coverImage.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content File */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Literary Work File (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="content" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload your work</span>
                      <input
                        id="content"
                        name="content"
                        type="file"
                        accept=".txt,.pdf,.doc,.docx"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, 'content')}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">TXT, PDF, DOC, DOCX up to 10MB</p>
                  {formData.content && (
                    <p className="text-sm text-green-600">✓ {formData.content.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Royalty Percentage */}
            <div>
              <label htmlFor="royaltyPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                Royalty Percentage
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  id="royaltyPercentage"
                  name="royaltyPercentage"
                  value={formData.royaltyPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.5"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-sm text-gray-600">% royalty on secondary sales</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You'll earn this percentage from every future sale of your NFT
              </p>
            </div>

            {/* Mint Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleMint}
                disabled={!isConnected || isLoading || !validateForm() || uploadStatus === 'uploading'}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadStatus === 'uploading' || isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    {uploadStatus === 'uploading' ? 'Uploading to IPFS...' : 'Minting NFT...'}
                  </>
                ) : (
                  'Mint NFT'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-blue-900">Upload</h4>
              <p className="text-sm text-blue-700">Your files are stored on IPFS for decentralized access</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-blue-900">Mint</h4>
              <p className="text-sm text-blue-700">Your NFT is created on the blockchain with royalties</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-blue-900">Earn</h4>
              <p className="text-sm text-blue-700">Receive royalties from all future sales automatically</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}