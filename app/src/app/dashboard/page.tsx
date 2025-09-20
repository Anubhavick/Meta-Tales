'use client'

import { Navigation } from '@/components/Navigation'
import { useState } from 'react'
import { BookOpen, Heart, FileImage, Edit3, Trash2, ExternalLink, Plus, Eye, DollarSign, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useUserNFTs } from '../../hooks/useUserNFTs'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'for-sale' | 'not-for-sale'>('all')

  const { address, isConnected } = useAccount()
  const { userNFTs, loading: nftsLoading, error, refreshNFTs, isEmpty, hasContract, currentNetwork } = useUserNFTs()

  // Calculate stats from user NFTs
  const totalNFTs = userNFTs.length
  const totalEarnings = userNFTs.reduce((sum, nft) => sum + parseFloat(nft.totalEarnings || '0'), 0)
  const totalViews = userNFTs.reduce((sum, nft) => sum + (nft.views || 0), 0)
  const totalLikes = userNFTs.reduce((sum, nft) => sum + (nft.likes || 0), 0)

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Navigation />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">Loading your NFT collection...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Creator Dashboard</h1>
          <p className="text-gray-600">Manage your literary NFTs and track your earnings</p>
          
          {/* Network Status */}
          {isConnected && (
            <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm ${hasContract ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              {hasContract ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
              {currentNetwork} {hasContract ? '(Active)' : '(No Contract)'}
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">
                Please connect your wallet to view your NFT collection and manage your literary works.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total NFTs</p>
                    <div className="text-2xl font-bold text-gray-900">{totalNFTs}</div>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <div className="text-2xl font-bold text-gray-900">{totalEarnings.toFixed(4)} ETH</div>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <div className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</div>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Likes</p>
                    <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-red-800 font-semibold">Error Loading NFTs</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* NFTs Section */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your NFT Collection</h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={refreshNFTs}
                      disabled={nftsLoading}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${nftsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <a
                      href="/mint"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New NFT
                    </a>
                  </div>
                </div>
                
                {/* Tabs */}
                <div className="mt-4">
                  <nav className="flex space-x-8" aria-label="Tabs">
                    {[
                      { key: 'all', label: 'All NFTs', count: userNFTs.length },
                      { key: 'for-sale', label: 'For Sale', count: userNFTs.filter(nft => nft.isForSale).length },
                      { key: 'not-for-sale', label: 'Not For Sale', count: userNFTs.filter(nft => !nft.isForSale).length }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.key
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="p-6">
                {isEmpty && !error ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No NFTs Yet</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't created any literary NFTs yet. Start by minting your first story, poem, or comic!
                    </p>
                    <a
                      href="/mint"
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First NFT
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNFTs.map((nft) => (
                      <div key={nft.id} className="bg-gray-50 rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                          <Image
                            src={nft.coverImage || '/placeholder-nft.png'}
                            alt={nft.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-nft.png'
                            }}
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContentTypeColor(nft.contentType)}`}>
                              {getContentTypeIcon(nft.contentType)}
                              <span className="ml-1 capitalize">{nft.contentType}</span>
                            </span>
                            <span className="text-xs text-gray-500">#{nft.tokenId}</span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{nft.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{nft.description}</p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {nft.views || 0}
                              </span>
                              <span className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {nft.likes || 0}
                              </span>
                            </div>
                            <span>{nft.royaltyPercentage}% royalty</span>
                          </div>
                          
                          {nft.isForSale && nft.price && (
                            <div className="mb-3 p-2 bg-green-50 rounded-md">
                              <span className="text-sm font-medium text-green-800">
                                For Sale: {nft.price} ETH
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-200">
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-gray-200">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {nft.txHash && (
                              <a
                                href={`https://sepolia.etherscan.io/tx/${nft.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-indigo-600 rounded-md hover:bg-gray-200"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}