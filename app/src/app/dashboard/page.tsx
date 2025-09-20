'use client'

import { Navigation } from '@/components/Navigation'
import { useState, useEffect } from 'react'
import { BookOpen, Heart, FileImage, Edit3, Trash2, ExternalLink, Plus, Eye, DollarSign } from 'lucide-react'
import Image from 'next/image'

interface UserNFT {
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
  lastSale?: {
    price: string
    date: string
  }
}

// Mock user data
const mockUserData = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  totalNFTs: 5,
  totalEarnings: '3.2',
  totalViews: 1247,
  totalLikes: 89
}

const mockUserNFTs: UserNFT[] = [
  {
    id: '1',
    title: 'Digital Dreams',
    description: 'A cyberpunk story about AI consciousness',
    contentType: 'story',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tokenId: '001',
    isForSale: true,
    price: '0.5',
    royaltyPercentage: 5,
    totalEarnings: '1.2',
    views: 342,
    likes: 28,
    createdAt: '2025-01-10',
    lastSale: {
      price: '0.4',
      date: '2025-01-12'
    }
  },
  {
    id: '2',
    title: 'Moonlight Sonnet',
    description: 'A collection of romantic poetry',
    contentType: 'poem',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tokenId: '002',
    isForSale: false,
    royaltyPercentage: 7.5,
    totalEarnings: '0.8',
    views: 156,
    likes: 19,
    createdAt: '2025-01-08'
  },
  {
    id: '3',
    title: 'Space Adventures',
    description: 'Comic series about interstellar exploration',
    contentType: 'comic',
    coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    tokenId: '003',
    isForSale: true,
    price: '1.0',
    royaltyPercentage: 10,
    totalEarnings: '1.2',
    views: 749,
    likes: 42,
    createdAt: '2025-01-05',
    lastSale: {
      price: '0.8',
      date: '2025-01-07'
    }
  }
]

export default function DashboardPage() {
  const [userNFTs, setUserNFTs] = useState<UserNFT[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'for-sale' | 'not-for-sale'>('all')

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUserNFTs(mockUserNFTs)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNFTs = userNFTs.filter(nft => {
    switch (activeTab) {
      case 'for-sale':
        return nft.isForSale
      case 'not-for-sale':
        return !nft.isForSale
      default:
        return true
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your literary NFT collection and track your earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{mockUserData.totalNFTs}</div>
                <div className="text-gray-600">Total NFTs</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{mockUserData.totalEarnings} ETH</div>
                <div className="text-gray-600">Total Earnings</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{mockUserData.totalViews.toLocaleString()}</div>
                <div className="text-gray-600">Total Views</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{mockUserData.totalLikes}</div>
                <div className="text-gray-600">Total Likes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Wallet Address:</span>
              <span className="ml-2 font-mono text-gray-900">{mockUserData.address}</span>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700">
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All NFTs ({userNFTs.length})
            </button>
            <button
              onClick={() => setActiveTab('for-sale')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'for-sale' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              For Sale ({userNFTs.filter(nft => nft.isForSale).length})
            </button>
            <button
              onClick={() => setActiveTab('not-for-sale')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'not-for-sale' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Not for Sale ({userNFTs.filter(nft => !nft.isForSale).length})
            </button>
          </div>

          <a
            href="/mint"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New NFT
          </a>
        </div>

        {/* NFT Grid */}
        {filteredNFTs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No NFTs found</h3>
            <p className="text-gray-600">
              {activeTab === 'all' 
                ? "You haven't created any NFTs yet." 
                : `You don't have any NFTs ${activeTab.replace('-', ' ')}.`}
            </p>
            {activeTab === 'all' && (
              <a
                href="/mint"
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First NFT
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft) => (
              <div key={nft.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                  {nft.isForSale && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        For Sale
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{nft.title}</h3>
                    <span className="text-sm text-gray-500">#{nft.tokenId}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{nft.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{nft.views}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{nft.likes}</div>
                      <div className="text-xs text-gray-500">Likes</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">{nft.totalEarnings} ETH</div>
                      <div className="text-xs text-gray-500">Earned</div>
                    </div>
                  </div>

                  {/* Price and Royalty */}
                  <div className="flex justify-between items-center mb-4">
                    {nft.isForSale ? (
                      <div className="text-lg font-semibold text-indigo-600">
                        {nft.price} ETH
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Not for sale</div>
                    )}
                    <div className="text-sm text-gray-500">
                      {nft.royaltyPercentage}% royalty
                    </div>
                  </div>

                  {/* Last Sale */}
                  {nft.lastSale && (
                    <div className="text-xs text-gray-500 mb-4">
                      Last sold for {nft.lastSale.price} ETH on {new Date(nft.lastSale.date).toLocaleDateString()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center">
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                      <Trash2 className="h-4 w-4" />
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