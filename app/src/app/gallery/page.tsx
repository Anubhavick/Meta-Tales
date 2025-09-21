'use client'

import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { useState, useEffect } from 'react'
import { Search, BookOpen, Heart, ExternalLink, User, FileImage, Sparkles, Filter, TrendingUp, Clock, Eye } from 'lucide-react'
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
  views: number
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
    views: 152,
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
    views: 89,
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
    views: 203,
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
    views: 76,
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
    views: 134,
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
    views: 98,
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
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30'
      case 'poem':
        return 'bg-purple-500/20 text-purple-200 border-purple-400/30'
      case 'comic':
        return 'bg-green-500/20 text-green-200 border-green-400/30'
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-400/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Literary NFT Gallery
          </h1>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
            Discover and collect unique literary works from creators around the world
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <div className="text-2xl font-bold text-white">{nfts.length}</div>
              <div className="text-purple-200 text-sm">Total NFTs</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <div className="text-2xl font-bold text-white">{nfts.filter(n => n.isForSale).length}</div>
              <div className="text-purple-200 text-sm">For Sale</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <div className="text-2xl font-bold text-white">{nfts.reduce((acc, n) => acc + n.views, 0).toLocaleString()}</div>
              <div className="text-purple-200 text-sm">Total Views</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4">
              <div className="text-2xl font-bold text-white">{nfts.reduce((acc, n) => acc + n.likes, 0)}</div>
              <div className="text-purple-200 text-sm">Total Likes</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8 shadow-2xl">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-purple-300 mr-2" />
            <h3 className="text-lg font-semibold text-white">Filter & Search</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
              <input
                type="text"
                placeholder="Search titles, descriptions, creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-purple-400 focus:border-purple-400 text-white placeholder-purple-200 backdrop-blur-sm"
              />
            </div>

            {/* Content Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | 'story' | 'poem' | 'comic')}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-purple-400 focus:border-purple-400 text-white backdrop-blur-sm"
            >
              <option value="all" className="text-gray-900">All Types</option>
              <option value="story" className="text-gray-900">Stories</option>
              <option value="poem" className="text-gray-900">Poems</option>
              <option value="comic" className="text-gray-900">Comics</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'likes' | 'price')}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:ring-purple-400 focus:border-purple-400 text-white backdrop-blur-sm"
            >
              <option value="newest" className="text-gray-900">Newest</option>
              <option value="oldest" className="text-gray-900">Oldest</option>
              <option value="likes" className="text-gray-900">Most Liked</option>
              <option value="price" className="text-gray-900">Highest Price</option>
            </select>

            {/* For Sale Only */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showForSaleOnly}
                onChange={(e) => setShowForSaleOnly(e.target.checked)}
                className="rounded border-white/30 text-purple-400 focus:ring-purple-400 bg-white/20"
              />
              <span className="text-sm text-purple-200">For sale only</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-purple-200">
            Showing {filteredAndSortedNFTs.length} of {nfts.length} NFTs
          </p>
        </div>

        {/* NFT Grid */}
        {filteredAndSortedNFTs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No NFTs found</h3>
            <p className="text-purple-300">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedNFTs.map((nft) => (
              <div key={nft.id} className="group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 shadow-2xl">
                {/* Cover Image */}
                <div className="relative h-52 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                  <Image
                    src={nft.coverImage}
                    alt={nft.title}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border border-white/30 ${getContentTypeColor(nft.contentType)}`}>
                      {getContentTypeIcon(nft.contentType)}
                      <span className="ml-1 capitalize">{nft.contentType}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white">
                    <div className="flex items-center text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {nft.views}
                    </div>
                    <div className="flex items-center text-sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {nft.likes}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">{nft.title}</h3>
                  <p className="text-purple-200 text-sm mb-4 line-clamp-2 leading-relaxed">{nft.description}</p>
                  
                  {/* Creator */}
                  <div className="flex items-center mb-4">
                    <User className="h-4 w-4 text-purple-300 mr-2" />
                    <span className="text-sm text-purple-200">
                      {nft.creator}
                    </span>
                  </div>

                  {/* Stats and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-sm text-purple-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(nft.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {nft.isForSale && nft.price && (
                      <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {nft.price} ETH
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-purple-500/25">
                      <Sparkles className="h-4 w-4 inline mr-2" />
                      View Details
                    </button>
                    {nft.isForSale && (
                      <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-green-500/25">
                        <TrendingUp className="h-4 w-4 inline mr-2" />
                        Buy Now
                      </button>
                    )}
                    <button className="p-2.5 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                      <ExternalLink className="h-4 w-4 text-purple-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}