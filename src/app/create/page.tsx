'use client'

import { useState } from 'react'
import { useWallet } from '@/components/WalletProvider'
import { Header } from '@/components/Header'
import { Upload, FileText, BookOpen, Image, Loader2, Wallet } from 'lucide-react'
import { CreateNFTForm } from '@/types'
import { ipfsService, createNFTMetadata } from '@/lib/ipfs'
import { getContract } from '@/lib/ethereum'

export default function CreatePage() {
  const { address, isConnected } = useWallet()
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CreateNFTForm>({
    title: '',
    description: '',
    content: '',
    contentType: 'story',
    genre: '',
    language: 'English',
    royaltyPercentage: 5,
    coverImage: undefined,
    additionalImages: []
  })

  const handleInputChange = (field: keyof CreateNFTForm, value: string | number | File | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
    setSuccess(null)
  }

  const handleFileUpload = (field: 'coverImage' | 'additionalImages', files: FileList | null) => {
    if (!files) return

    if (field === 'coverImage') {
      setFormData(prev => ({ ...prev, coverImage: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, additionalImages: Array.from(files) }))
    }
  }

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Title is required'
    if (!formData.description.trim()) return 'Description is required'
    if (!formData.content.trim()) return 'Content is required'
    if (formData.royaltyPercentage < 0 || formData.royaltyPercentage > 10) {
      return 'Royalty percentage must be between 0 and 10%'
    }
    if (!formData.coverImage) return 'Cover image is required'
    return null
  }

  const handleCreateNFT = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setIsUploading(true)
      setError(null)

      // Upload cover image to IPFS
      const coverImageResult = await ipfsService.uploadFile(formData.coverImage!)
      console.log('Cover image uploaded:', coverImageResult.url)

      // Create metadata
      const metadata = createNFTMetadata(
        formData.title,
        formData.description,
        coverImageResult.url,
        formData.contentType,
        formData.content,
        formData.genre,
        formData.language
      )

      // Upload metadata to IPFS
      const metadataResult = await ipfsService.uploadNFTMetadata(metadata)
      console.log('Metadata uploaded:', metadataResult.url)

      setIsUploading(false)
      setIsMinting(true)

      // Mint NFT
      const contract = await getContract()
      if (!contract) {
        throw new Error('Failed to get contract instance')
      }

      const royaltyBasisPoints = Math.floor(formData.royaltyPercentage * 100)
      const tx = await contract.mintNFT(address, metadataResult.url, royaltyBasisPoints)
      
      console.log('Minting transaction:', tx.hash)
      
      // Wait for transaction confirmation
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)

      setSuccess(`NFT created successfully! Transaction: ${tx.hash}`)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        contentType: 'story',
        genre: '',
        language: 'English',
        royaltyPercentage: 5,
        coverImage: undefined,
        additionalImages: []
      })

    } catch (error) {
      console.error('Error creating NFT:', error)
      setError(error instanceof Error ? error.message : 'Failed to create NFT')
    } finally {
      setIsUploading(false)
      setIsMinting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Wallet className="h-16 w-16 text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted">Please connect your wallet to create NFTs</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Create Your NFT</h1>
          
          <div className="bg-primary rounded-xl p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                placeholder="Enter the title of your work"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none h-24 resize-none"
                placeholder="Describe your work"
              />
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Content Type *</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'story', icon: BookOpen, label: 'Story' },
                  { value: 'poem', icon: FileText, label: 'Poem' },
                  { value: 'comic', icon: Image, label: 'Comic' }
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => handleInputChange('contentType', value)}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      formData.contentType === value
                        ? 'border-accent bg-accent/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none h-40 resize-none"
                placeholder={`Enter your ${formData.contentType} content here...`}
              />
            </div>

            {/* Genre and Language */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Genre</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                  placeholder="e.g., Fantasy, Romance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Cover Image *</label>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted mx-auto mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('coverImage', e.target.files)}
                  className="hidden"
                  id="cover-image"
                />
                <label htmlFor="cover-image" className="cursor-pointer">
                  <span className="text-accent hover:text-accent/80">Click to upload</span>
                  <span className="text-muted"> or drag and drop</span>
                </label>
                {formData.coverImage && (
                  <div className="mt-2 text-sm text-green-400">
                    Selected: {formData.coverImage.name}
                  </div>
                )}
              </div>
            </div>

            {/* Royalty Percentage */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Royalty Percentage ({formData.royaltyPercentage}%)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={formData.royaltyPercentage}
                onChange={(e) => handleInputChange('royaltyPercentage', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted mt-1">
                <span>0%</span>
                <span>10%</span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                {success}
              </div>
            )}

            {/* Create Button */}
            <button
              onClick={handleCreateNFT}
              disabled={isUploading || isMinting}
              className="w-full bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {(isUploading || isMinting) && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isUploading ? 'Uploading to IPFS...' : 
                 isMinting ? 'Minting NFT...' : 
                 'Create NFT'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}