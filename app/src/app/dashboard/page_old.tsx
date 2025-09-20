'use client'

import { Navigation } from '@/components/Navigation'
import { useState } from 'react'
import { BookOpen, Heart, FileImage, Edit3, Trash2, ExternalLink, Plus, Eye, DollarSign, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useUserNFTs } from '../../hooks/useUserNFTs'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'for-sale' | 'not-for-sale'>('all')

  const { address, isConnected } = useAccount()
  const { userNFTs, loading, error, refreshNFTs, isEmpty, hasContract, currentNetwork } = useUserNFTs()

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

  if (nftsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-4">
              Please connect your wallet to view your NFT dashboard.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading NFTs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
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
                <div className="text-2xl font-bold text-gray-900">{totalNFTs}</div>
                <div className="text-gray-600">Total NFTs</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalEarnings} ETH</div>
                <div className="text-gray-600">Total Earnings</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                <div className="text-gray-600">Total Views</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
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
              <span className="ml-2 font-mono text-gray-900">{address || 'Not connected'}</span>
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

          <div className="flex space-x-3">
            <button
              onClick={refreshNFTs}
              disabled={nftsLoading}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${nftsLoading ? 'animate-spin' : ''}`} />
              Refresh NFTs
            </button>
            <a
              href="/mint"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New NFT
            </a>
          </div>
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