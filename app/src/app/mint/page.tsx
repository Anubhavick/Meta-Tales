'use client'

import { Navigation } from '@/components/Navigation'
import { useState } from 'react'
import { FileText, ImageIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

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
  const [formData, setFormData] = useState<MintFormData>({
    title: '',
    description: '',
    contentType: '',
    content: null,
    coverImage: null,
    royaltyPercentage: 5
  })
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string>('')

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
      formData.content &&
      formData.coverImage
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    setIsUploading(true)
    setUploadStatus('uploading')

    try {
      // TODO: Integrate with IPFS upload and smart contract
      // This is placeholder logic - will be replaced with actual implementation
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setUploadStatus('success')
      setTxHash('0x1234567890abcdef...')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        contentType: '',
        content: null,
        coverImage: null,
        royaltyPercentage: 5
      })
      
    } catch (error) {
      console.error('Minting failed:', error)
      setUploadStatus('error')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

        {uploadStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-green-800 font-semibold">NFT Minted Successfully!</h3>
                <p className="text-green-700">
                  Transaction Hash: <span className="font-mono text-sm">{txHash}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-semibold">Minting Failed</h3>
                <p className="text-red-700">
                  There was an error minting your NFT. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter the title of your work"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe your literary work..."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select content type</option>
                <option value="story">Story</option>
                <option value="poem">Poem</option>
                <option value="comic">Comic</option>
              </select>
            </div>

            {/* Content File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Literary Work File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="content" className="cursor-pointer">
                  <span className="text-indigo-600 font-medium hover:text-indigo-700">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    id="content"
                    className="hidden"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, 'content')}
                    required
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supports TXT, PDF, DOC, DOCX files
                </p>
                {formData.content && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.content.name}
                  </p>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="coverImage" className="cursor-pointer">
                  <span className="text-indigo-600 font-medium hover:text-indigo-700">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    id="coverImage"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'coverImage')}
                    required
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
                {formData.coverImage && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.coverImage.name}
                  </p>
                )}
              </div>
            </div>

            {/* Royalty Percentage */}
            <div>
              <label htmlFor="royaltyPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                Royalty Percentage (%)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  id="royaltyPercentage"
                  name="royaltyPercentage"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.royaltyPercentage}
                  onChange={handleInputChange}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900 w-12">
                  {formData.royaltyPercentage}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                You&apos;ll earn this percentage on all future sales of your NFT
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={!validateForm() || isUploading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  validateForm() && !isUploading
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Minting NFT...
                  </div>
                ) : (
                  'Mint NFT'
                )}
              </button>
            </div>
          </form>

          {/* Minting Process Info */}
          <div className="mt-8 bg-blue-50 rounded-lg p-4">
            <h3 className="text-blue-800 font-semibold mb-2">What happens when you mint?</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Your files are uploaded to IPFS for permanent storage</li>
              <li>• Metadata is generated and stored on-chain</li>
              <li>• An ERC-721 NFT is minted with your specified royalty rate</li>
              <li>• You become the verified owner of your literary work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}