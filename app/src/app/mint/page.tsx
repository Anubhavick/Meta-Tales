'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useState } from 'react'
import { FileText, ImageIcon, AlertCircle, CheckCircle, Loader2, Sparkles, RefreshCw, Wand2 } from 'lucide-react'
import { useMintNFT } from '../../hooks/useMintNFT'
import { useAccount } from 'wagmi'
import { geminiAI, type ImprovementOptions } from '@/services/geminiAI'

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
  
  // AI Enhancement states
  const [aiLoading, setAiLoading] = useState<{
    title: boolean
    description: boolean
    grammar: boolean
  }>({
    title: false,
    description: false,
    grammar: false
  })
  const [aiSuggestions, setAiSuggestions] = useState<{
    titles: string[]
    originalDescription: string
    enhancedDescription: string
  }>({
    titles: [],
    originalDescription: '',
    enhancedDescription: ''
  })

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

  // AI Enhancement Functions
  const correctGrammar = async (field: 'title' | 'description') => {
    const text = formData[field]
    if (!text.trim()) return

    setAiLoading(prev => ({ ...prev, grammar: true }))
    
    try {
      const result = await geminiAI.correctGrammar(text, formData.contentType || 'general')
      
      if (result.success && result.content) {
        setFormData(prev => ({
          ...prev,
          [field]: result.content!.trim()
        }))
      } else {
        setErrorMessage(result.error || 'Failed to correct grammar')
      }
    } catch (error) {
      console.error('Grammar correction failed:', error)
      setErrorMessage('Grammar correction failed. Please try again.')
    } finally {
      setAiLoading(prev => ({ ...prev, grammar: false }))
    }
  }

  const enhanceDescription = async () => {
    if (!formData.description.trim()) return

    setAiLoading(prev => ({ ...prev, description: true }))
    
    try {
      // Store original for comparison
      setAiSuggestions(prev => ({
        ...prev,
        originalDescription: formData.description
      }))

      const result = await geminiAI.improveDescription(
        formData.description,
        formData.title,
        formData.contentType || 'story'
      )
      
      if (result.success && result.content) {
        setAiSuggestions(prev => ({
          ...prev,
          enhancedDescription: result.content!.trim()
        }))
      } else {
        setErrorMessage(result.error || 'Failed to enhance description')
      }
    } catch (error) {
      console.error('Description enhancement failed:', error)
      setErrorMessage('Description enhancement failed. Please try again.')
    } finally {
      setAiLoading(prev => ({ ...prev, description: false }))
    }
  }

  const generateTitleSuggestions = async () => {
    if (!formData.description.trim() && !formData.title.trim()) {
      setErrorMessage('Please add a title or description first')
      return
    }

    setAiLoading(prev => ({ ...prev, title: true }))
    
    try {
      const content = formData.description || formData.title
      const result = await geminiAI.generateTitle(content, formData.contentType || 'story')
      
      if (result.success && result.content) {
        // Parse the numbered list from Gemini
        const titles = result.content
          .split('\n')
          .filter(line => line.match(/^\d+\./))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(title => title.length > 0)
        
        setAiSuggestions(prev => ({
          ...prev,
          titles
        }))
      } else {
        setErrorMessage(result.error || 'Failed to generate title suggestions')
      }
    } catch (error) {
      console.error('Title generation failed:', error)
      setErrorMessage('Title generation failed. Please try again.')
    } finally {
      setAiLoading(prev => ({ ...prev, title: false }))
    }
  }

  const applyEnhancedDescription = () => {
    if (aiSuggestions.enhancedDescription) {
      setFormData(prev => ({
        ...prev,
        description: aiSuggestions.enhancedDescription
      }))
      setAiSuggestions(prev => ({
        ...prev,
        enhancedDescription: '',
        originalDescription: ''
      }))
    }
  }

  const revertToOriginalDescription = () => {
    if (aiSuggestions.originalDescription) {
      setFormData(prev => ({
        ...prev,
        description: aiSuggestions.originalDescription
      }))
      setAiSuggestions(prev => ({
        ...prev,
        enhancedDescription: '',
        originalDescription: ''
      }))
    }
  }

  const selectTitle = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title
    }))
    setAiSuggestions(prev => ({
      ...prev,
      titles: []
    }))
  }

  // Test API connection
  const testGeminiAPI = async () => {
    setAiLoading(prev => ({ ...prev, grammar: true }))
    
    try {
      const result = await geminiAI.testConnection()
      
      if (result.success) {
        alert(`API Test Successful! Response: ${result.content}`)
      } else {
        alert(`API Test Failed: ${result.error}`)
      }
    } catch (error) {
      console.error('API test failed:', error)
      alert(`API Test Error: ${error}`)
    } finally {
      setAiLoading(prev => ({ ...prev, grammar: false }))
    }
  }

  // List available models
  const listModels = async () => {
    setAiLoading(prev => ({ ...prev, title: true }))
    
    try {
      const result = await geminiAI.listModels()
      
      if (result.success) {
        console.log('Available models:', result.content)
        alert(`Available models logged to console. Check browser console (F12) for details.`)
      } else {
        alert(`Failed to list models: ${result.error}`)
      }
    } catch (error) {
      console.error('List models failed:', error)
      alert(`List Models Error: ${error}`)
    } finally {
      setAiLoading(prev => ({ ...prev, title: false }))
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered NFT Creation
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Mint Your
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"> Literary NFT</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your creative work into a blockchain-verified NFT with built-in royalties and AI-powered enhancements
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-10 mb-16">
          <form className="space-y-10">
            {/* Title */}
            <div className="space-y-3">
              <label htmlFor="title" className="block text-base font-bold text-gray-900 mb-3">
                Title *
              </label>
              <div className="relative">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter the title of your literary work"
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => correctGrammar('title')}
                    disabled={aiLoading.grammar || !formData.title.trim()}
                    className="px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 border-0 rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="Fix grammar and spelling"
                  >
                    {aiLoading.grammar ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={generateTitleSuggestions}
                    disabled={aiLoading.title || (!formData.description.trim() && !formData.title.trim())}
                    className="px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 border-0 rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    title="Generate title suggestions"
                  >
                    {aiLoading.title ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {/* Title Suggestions */}
              {aiSuggestions.titles.length > 0 && (
                <div className="mt-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                  <h4 className="text-base font-bold text-purple-900 mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    AI Title Suggestions:
                  </h4>
                  <div className="space-y-2">
                    {aiSuggestions.titles.map((title, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectTitle(title)}
                        className="block w-full text-left px-4 py-3 text-sm text-purple-800 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:shadow-md font-medium"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiSuggestions(prev => ({ ...prev, titles: [] }))}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Close suggestions
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label htmlFor="description" className="block text-base font-bold text-gray-900 mb-3">
                Description *
              </label>
              <div className="space-y-4">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe your literary work, its themes, and what makes it special"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-all duration-200 text-lg resize-none"
                  required
                />
                
                {/* AI Enhancement Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => correctGrammar('description')}
                    disabled={aiLoading.grammar || !formData.description.trim()}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 border-0 rounded-2xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {aiLoading.grammar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span>Fix Grammar</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={enhanceDescription}
                    disabled={aiLoading.description || !formData.description.trim()}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 border-0 rounded-2xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {aiLoading.description ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    <span>Enhance with AI</span>
                  </button>
                </div>
              </div>
              {/* Enhanced Description Preview */}
              {aiSuggestions.enhancedDescription && (
                <div className="mt-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-green-900 flex items-center">
                      <Sparkles className="h-5 w-5 mr-2" />
                      AI Enhanced Description:
                    </h4>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={applyEnhancedDescription}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                      >
                        Use This
                      </button>
                      <button
                        type="button"
                        onClick={revertToOriginalDescription}
                        className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-colors"
                      >
                        Keep Original
                      </button>
                    </div>
                  </div>
                  <p className="text-base text-green-800 leading-relaxed">
                    {aiSuggestions.enhancedDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Content Type */}
            <div className="space-y-3">
              <label htmlFor="contentType" className="block text-base font-bold text-gray-900 mb-3">
                Content Type *
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white text-lg"
                required
              >
                <option value="">Select content type</option>
                <option value="story">📖 Story</option>
                <option value="poem">🎭 Poem</option>
                <option value="comic">🎨 Comic</option>
              </select>
            </div>

            {/* Cover Image */}
            <div className="space-y-3">
              <label htmlFor="coverImage" className="block text-base font-bold text-gray-900 mb-3">
                Cover Image *
              </label>
              <div className="mt-1 flex justify-center px-8 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-3xl hover:border-purple-400 transition-colors duration-200 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="space-y-2 text-center">
                  <ImageIcon className="mx-auto h-16 w-16 text-gray-400" />
                  <div className="flex text-lg text-gray-600">
                    <label htmlFor="coverImage" className="relative cursor-pointer bg-white rounded-2xl font-semibold text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 px-4 py-2 shadow-md hover:shadow-lg transition-all duration-200">
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
                    <p className="pl-2 self-center">or drag and drop</p>
                  </div>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  {formData.coverImage && (
                    <p className="text-base text-green-600 font-semibold">✓ {formData.coverImage.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content File */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-800 mb-2">
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
            <div className="space-y-2">
              <label htmlFor="royaltyPercentage" className="block text-sm font-semibold text-gray-800 mb-2">
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
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                />
                <span className="text-sm text-gray-600">% royalty on secondary sales</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You'll earn this percentage from every future sale of your NFT
              </p>
            </div>

            {/* Mint Button */}
            <div className="pt-8">
              <button
                type="button"
                onClick={handleMint}
                disabled={!isConnected || isLoading || !validateForm() || uploadStatus === 'uploading'}
                className="w-full flex justify-center items-center py-6 px-8 border-0 rounded-3xl shadow-2xl text-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
              >
                {uploadStatus === 'uploading' || isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-4 h-6 w-6" />
                    {uploadStatus === 'uploading' ? 'Uploading to IPFS...' : 'Minting NFT...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-6 w-6" />
                    Mint Your NFT
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Information Section */}
        <div className="mt-20 space-y-12">
          {/* AI Features Section */}
          <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-3xl p-10 border border-purple-200 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-purple-900 flex items-center">
                <Sparkles className="h-7 w-7 mr-3 text-purple-600" />
                AI-Powered Enhancement Features
              </h3>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={listModels}
                  disabled={aiLoading.title}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-300 rounded-xl hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
                >
                  {aiLoading.title ? <Loader2 className="h-4 w-4 animate-spin" /> : 'List Models'}
                </button>
                <button
                  type="button"
                  onClick={testGeminiAPI}
                  disabled={aiLoading.grammar}
                  className="px-4 py-2 text-sm font-semibold text-purple-600 bg-purple-100 border border-purple-300 rounded-xl hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all duration-200"
                >
                  {aiLoading.grammar ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Test API'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-purple-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Wand2 className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-purple-900 text-lg mb-2">Grammar Correction</h4>
                <p className="text-base text-purple-700">Fix spelling and grammar errors while preserving your unique voice</p>
              </div>
              <div className="text-center group">
                <div className="bg-purple-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-purple-900 text-lg mb-2">Content Enhancement</h4>
                <p className="text-base text-purple-700">Improve descriptions to make them more engaging for collectors</p>
              </div>
              <div className="text-center group">
                <div className="bg-purple-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <RefreshCw className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-purple-900 text-lg mb-2">Title Suggestions</h4>
                <p className="text-base text-purple-700">Generate creative titles that capture your work's essence</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 shadow-xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-blue-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-blue-600 font-bold text-2xl">1</span>
                </div>
                <h4 className="font-bold text-blue-900 text-lg mb-2">Upload</h4>
                <p className="text-base text-blue-700">Your files are stored on IPFS for decentralized access</p>
              </div>
              <div className="text-center group">
                <div className="bg-blue-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-blue-600 font-bold text-2xl">2</span>
                </div>
                <h4 className="font-bold text-blue-900 text-lg mb-2">Mint</h4>
                <p className="text-base text-blue-700">Your NFT is created on the blockchain with royalties</p>
              </div>
              <div className="text-center group">
                <div className="bg-blue-100 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-blue-600 font-bold text-2xl">3</span>
                </div>
                <h4 className="font-bold text-blue-900 text-lg mb-2">Earn</h4>
                <p className="text-base text-blue-700">Receive royalties from all future sales automatically</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}