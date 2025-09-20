'use client'

import { Navigation } from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { Search, BookOpen, Heart, ExternalLink, User, FileImage } from 'lucide-react'
import Image from 'next/image'

interface NFTItem {
  id: string
  title: string
  description: string
  contentType: 'story' | 'poem' | 'comic'
  coverImage: string
  creator: string
  creatorAddress: string
  price?: string
  isForSale: boolean
  likes: number
  createdAt: string
}

// Mock data - will be replaced with blockchain queries
const mockNFTs: NFTItem[] = [
  {
    id: '1',
    title: 'The Digital Wanderer',
    description: 'A captivating tale of virtual reality and human connection in a dystopian future.',
    contentType: 'story',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    creator: 'Alex Rivera',
    creatorAddress: '0x1234...5678',
    price: '0.5',
    isForSale: true,
    likes: 24,
    createdAt: '2025-01-15'
  },
  {
    id: '2',
    title: 'Quantum Dreams',
    description: 'Poetry exploring the intersection of quantum physics and human consciousness.',
    contentType: 'poem',
    coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    creator: 'Maya Chen',
    creatorAddress: '0xabcd...efgh',
    isForSale: false,
    likes: 18,
    createdAt: '2025-01-14'
  },
  {
    id: '3',
    title: 'Chronicles of Zenith',
    description: 'An epic comic series following heroes in a magical steampunk world.',
    contentType: 'comic',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    creator: 'James Wright',
    creatorAddress: '0x9876...4321',
    price: '1.2',
    isForSale: true,
    likes: 42,
    createdAt: '2025-01-13'
  },
  {
    id: '4',
    title: 'Ethereal Verses',
    description: 'A collection of poems about love, loss, and rebirth in the digital age.',
    contentType: 'poem',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    creator: 'Sarah Kim',
    creatorAddress: '0xfedc...ba98',
    price: '0.3',
    isForSale: true,
    likes: 31,
    createdAt: '2025-01-12'
  },
  {
    id: '5',
    title: 'The Last Library',
    description: 'A post-apocalyptic story about the preservation of human knowledge.',
    contentType: 'story',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    creator: 'David Park',
    creatorAddress: '0x5555...6666',
    isForSale: false,
    likes: 67,
    createdAt: '2025-01-11'
  },
  {
    id: '6',
    title: 'Cyber Samurai',
    description: 'Manga-style comic blending traditional Japanese culture with cyberpunk aesthetics.',
    contentType: 'comic',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    creator: 'Yuki Tanaka',
    creatorAddress: '0x7777...8888',
    price: '0.8',
    isForSale: true,
    likes: 55,
    createdAt: '2025-01-10'
  }
]

export default function GalleryPage() {
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'story' | 'poem' | 'comic'>('all')
  const [showForSaleOnly, setShowForSaleOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'likes' | 'price'>('newest')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setNfts(mockNFTs)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredAndSortedNFTs = nfts
    .filter(nft => {
      const matchesSearch = nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           nft.creator.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || nft.contentType === selectedType
      const matchesForSale = !showForSaleOnly || nft.isForSale
      
      return matchesSearch && matchesType && matchesForSale
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'likes':
          return b.likes - a.likes
        case 'price':
          const aPrice = a.price ? parseFloat(a.price) : 0
          const bPrice = b.price ? parseFloat(b.price) : 0
          return bPrice - aPrice
        default:
          return 0
      }
    })

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'story':
        return <BookOpen className="h-4 w-4" />
      case 'poem':
        return <Heart className="h-4 w-4" />
      case 'comic':
        return <FileImage className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'story':
        return 'bg-blue-100 text-blue-800'
      case 'poem':
        return 'bg-purple-100 text-purple-800'
      case 'comic':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Literary NFT Gallery
          </h1>
          <p className="text-xl text-gray-600">
            Discover and collect unique literary works from creators around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search titles, descriptions, creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Content Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'story' | 'poem' | 'comic')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="story">Stories</option>
              <option value="poem">Poems</option>
              <option value="comic">Comics</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'likes' | 'price')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="likes">Most Liked</option>
              <option value="price">Highest Price</option>
            </select>

            {/* For Sale Only */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showForSaleOnly}
                onChange={(e) => setShowForSaleOnly(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">For sale only</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedNFTs.length} of {nfts.length} NFTs
          </p>
        </div>

        {/* NFT Grid */}
        {filteredAndSortedNFTs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No NFTs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedNFTs.map((nft) => (
              <div key={nft.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Cover Image */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={nft.coverImage}
                    alt={nft.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getContentTypeColor(nft.contentType)}`}>
                      {getContentTypeIcon(nft.contentType)}
                      <span className="ml-1 capitalize">{nft.contentType}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{nft.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{nft.description}</p>
                  
                  {/* Creator */}
                  <div className="flex items-center mb-4">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {nft.creator}
                    </span>
                  </div>

                  {/* Stats and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Heart className="h-4 w-4 mr-1" />
                        {nft.likes}
                      </div>
                    </div>
                    
                    {nft.isForSale && nft.price && (
                      <div className="text-lg font-semibold text-indigo-600">
                        {nft.price} ETH
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                      View Details
                    </button>
                    {nft.isForSale && (
                      <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Buy Now
                      </button>
                    )}
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}