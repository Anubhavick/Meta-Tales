'use client'

import { Navigation } from '@/components/Navigation'
import { AddHardhatNetworkButton } from '@/components/AddHardhatNetworkButton'
import { NetworkSelector } from '@/components/NetworkSelector'
import { useState } from 'react'
import { BookOpen, Heart, FileImage, Edit3, Trash2, ExternalLink, Plus, Eye, DollarSign, RefreshCw, AlertCircle, Wifi, WifiOff, Clock, Activity, TrendingUp, Network } from 'lucide-react'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useUserNFTs } from '../../hooks/useUserNFTs'
import { useMetaMaskHistory } from '../../hooks/useMetaMaskHistory'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'nfts' | 'history' | 'analytics' | 'networks'>('nfts')

  const { address, isConnected } = useAccount()
  const { userNFTs, loading: nftsLoading, error, refreshNFTs, isEmpty, hasContract, currentNetwork } = useUserNFTs()
  const { userActivity, loading: historyLoading, refreshActivity, isHardhatNetwork } = useMetaMaskHistory()

  // Calculate enhanced stats from user NFTs and MetaMask history
  const totalNFTs = userNFTs.length
  const totalEarnings = userNFTs.reduce((sum, nft) => sum + parseFloat(nft.totalEarnings || '0'), 0)
  const totalViews = userNFTs.reduce((sum, nft) => sum + (nft.views || 0), 0)
  const totalLikes = userNFTs.reduce((sum, nft) => sum + (nft.likes || 0), 0)
  
  // Calculate additional metrics
  const averageRoyalty = userNFTs.length > 0 
    ? userNFTs.reduce((sum, nft) => sum + (nft.royaltyPercentage || 5), 0) / userNFTs.length 
    : 0
  
  // Estimate portfolio value based on last sale or default value
  const portfolioValue = userNFTs.reduce((sum, nft) => {
    const lastSalePrice = nft.lastSale ? parseFloat(nft.lastSale.price) : 0.001
    return sum + lastSalePrice
  }, 0)
  
  const contentTypeDistribution = userNFTs.reduce((acc, nft) => {
    acc[nft.contentType] = (acc[nft.contentType] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostPopularType = Object.entries(contentTypeDistribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'story'
  
  const avgViewsPerNFT = totalNFTs > 0 ? Math.round(totalViews / totalNFTs) : 0
  const avgLikesPerNFT = totalNFTs > 0 ? Math.round(totalLikes / totalNFTs) : 0

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

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'mint':
        return 'bg-green-100 text-green-800'
      case 'transfer':
        return 'bg-blue-100 text-blue-800'
      case 'approval':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (nftsLoading || historyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <Navigation />
        <main className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
              <p className="text-gray-600">Loading your dashboard...</p>
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
          <p className="text-gray-600">Manage your literary NFTs and track your on-chain activity</p>
          
          {/* Network Status */}
          {isConnected && (
            <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm ${hasContract && isHardhatNetwork ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
              {hasContract && isHardhatNetwork ? <Wifi className="h-4 w-4 mr-1" /> : <WifiOff className="h-4 w-4 mr-1" />}
              {currentNetwork} {hasContract && isHardhatNetwork ? '(Connected)' : '(Switch to Hardhat)'}
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">
                Please connect your wallet to view your NFT collection and on-chain activity.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Network Warning Banner (only if not on optimal network) */}
            {isConnected && (!hasContract || !isHardhatNetwork) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                  <div className="flex-1">
                    <h3 className="text-orange-800 font-semibold">Network Notice</h3>
                    <p className="text-orange-700">
                      You're connected to {currentNetwork}. For full functionality, consider switching to a network with deployed contracts.
                    </p>
                  </div>
                  <div className="ml-4">
                    <AddHardhatNetworkButton />
                  </div>
                </div>
              </div>
            )}

            {/* Earnings Highlight Banner */}
            {totalEarnings > 0 && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">🎉 Congratulations!</h2>
                    <p className="text-green-100 mt-1">You've earned {totalEarnings.toFixed(6)} ETH from your literary NFTs</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{totalEarnings.toFixed(4)} ETH</div>
                    <p className="text-green-100">Total Earnings</p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total NFTs */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total NFTs</p>
                    <div className="text-2xl font-bold text-gray-900">{totalNFTs}</div>
                    <p className="text-xs text-gray-500 mt-1">Literary works minted</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Earnings */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <div className="text-2xl font-bold text-green-600">{totalEarnings.toFixed(4)} ETH</div>
                    <p className="text-xs text-gray-500 mt-1">From royalties & sales</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Portfolio Value */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                    <div className="text-2xl font-bold text-purple-600">{portfolioValue.toFixed(4)} ETH</div>
                    <p className="text-xs text-gray-500 mt-1">Estimated total value</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Total Engagement */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                    <div className="text-2xl font-bold text-pink-600">{totalViews + totalLikes}</div>
                    <p className="text-xs text-gray-500 mt-1">{totalViews} views, {totalLikes} likes</p>
                  </div>
                  <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-700">{userActivity.totalMinted}</div>
                  <p className="text-sm text-blue-600">Minted</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">{averageRoyalty.toFixed(1)}%</div>
                  <p className="text-sm text-green-600">Avg Royalty</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-700">{avgViewsPerNFT}</div>
                  <p className="text-sm text-orange-600">Avg Views</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-700">{mostPopularType}</div>
                  <p className="text-sm text-purple-600">Top Genre</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200 p-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-700">{parseFloat(userActivity.totalGasSpent).toFixed(3)}</div>
                  <p className="text-sm text-gray-600">Gas Spent</p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <div>
                    <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <nav className="flex space-x-8" aria-label="Tabs">
                    {[
                      { key: 'nfts', label: 'My NFTs', icon: BookOpen },
                      { key: 'history', label: 'Transaction History', icon: Clock },
                      { key: 'analytics', label: 'Analytics', icon: TrendingUp },
                      { key: 'networks', label: 'Networks', icon: Network }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.key
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => {
                        refreshNFTs()
                        refreshActivity()
                      }}
                      disabled={nftsLoading || historyLoading}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${(nftsLoading || historyLoading) ? 'animate-spin' : ''}`} />
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
              </div>

              <div className="p-6">
                {/* NFTs Tab */}
                {activeTab === 'nfts' && (
                  <>
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
                        {userNFTs.map((nft) => (
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
                                    href={`http://127.0.0.1:8545/tx/${nft.txHash}`}
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
                  </>
                )}

                {/* Transaction History Tab */}
                {activeTab === 'history' && (
                  <div>
                    {userActivity.recentActivity.length === 0 ? (
                      <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transaction History</h3>
                        <p className="text-gray-600">
                          Your transaction history will appear here once you start minting or trading NFTs.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userActivity.recentActivity.map((tx) => (
                          <div key={tx.hash} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(tx.type)}`}>
                                  {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                </span>
                                {tx.tokenId && (
                                  <span className="text-sm text-gray-600">Token #{tx.tokenId}</span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatTimestamp(tx.timestamp)}
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm">
                                <span className="text-gray-600">From: </span>
                                <span className="font-mono text-gray-900">{truncateAddress(tx.from)}</span>
                                <span className="text-gray-600 mx-2">→</span>
                                <span className="text-gray-600">To: </span>
                                <span className="font-mono text-gray-900">{truncateAddress(tx.to)}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {tx.gasUsed && (
                                  <span className="text-xs text-gray-500">
                                    Gas: {parseInt(tx.gasUsed).toLocaleString()}
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded ${
                                  tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {tx.status}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <a
                                href={`http://127.0.0.1:8545/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-mono"
                              >
                                {tx.hash}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-8">
                    {/* Financial Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-green-800">💰 Financial Overview</h3>
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-green-700">Total Earnings:</span>
                            <span className="font-bold text-green-800">{totalEarnings.toFixed(6)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Portfolio Value:</span>
                            <span className="font-bold text-green-800">{portfolioValue.toFixed(6)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Avg Royalty Rate:</span>
                            <span className="font-bold text-green-800">{averageRoyalty.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-700">Earnings per NFT:</span>
                            <span className="font-bold text-green-800">
                              {totalNFTs > 0 ? (totalEarnings / totalNFTs).toFixed(6) : '0'} ETH
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-blue-800">📊 Content Analytics</h3>
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Total Views:</span>
                            <span className="font-bold text-blue-800">{totalViews.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Total Likes:</span>
                            <span className="font-bold text-blue-800">{totalLikes.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Avg Views per NFT:</span>
                            <span className="font-bold text-blue-800">{avgViewsPerNFT}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Engagement Rate:</span>
                            <span className="font-bold text-blue-800">
                              {totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : '0'}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-purple-800">⛽ Network Stats</h3>
                          <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-purple-700">Current Network:</span>
                            <span className="font-bold text-purple-800">{currentNetwork}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Total Transactions:</span>
                            <span className="font-bold text-purple-800">{userActivity.totalTransactions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Gas Spent:</span>
                            <span className="font-bold text-purple-800">{parseFloat(userActivity.totalGasSpent).toFixed(6)} ETH</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-purple-700">Avg Gas per Tx:</span>
                            <span className="font-bold text-purple-800">
                              {userActivity.totalTransactions > 0 
                                ? (parseFloat(userActivity.totalGasSpent) / userActivity.totalTransactions).toFixed(6)
                                : '0'} ETH
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg p-6 border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Content Type Distribution</h3>
                        <div className="space-y-4">
                          {Object.entries(contentTypeDistribution).map(([type, count]) => {
                            const percentage = totalNFTs > 0 ? (count / totalNFTs) * 100 : 0
                            const colorMap = {
                              story: 'bg-blue-500',
                              poem: 'bg-purple-500',
                              comic: 'bg-green-500'
                            }
                            return (
                              <div key={type} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    {getContentTypeIcon(type)}
                                    <span className="capitalize font-medium">{type}s</span>
                                  </div>
                                  <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${colorMap[type as keyof typeof colorMap] || 'bg-gray-500'}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Insights</h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp className="h-5 w-5 text-yellow-600" />
                              <span className="font-semibold text-yellow-800">Best Performing Genre</span>
                            </div>
                            <p className="text-yellow-700 capitalize">{mostPopularType} ({contentTypeDistribution[mostPopularType] || 0} NFTs)</p>
                          </div>
                          
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Eye className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-blue-800">Average Engagement</span>
                            </div>
                            <p className="text-blue-700">{avgViewsPerNFT} views & {avgLikesPerNFT} likes per NFT</p>
                          </div>

                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-800">Revenue Potential</span>
                            </div>
                            <p className="text-green-700">
                              {averageRoyalty.toFixed(1)}% avg royalty rate
                              {totalEarnings > 0 && ` • ${((totalEarnings / portfolioValue) * 100).toFixed(1)}% ROI`}
                            </p>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Activity className="h-5 w-5 text-purple-600" />
                              <span className="font-semibold text-purple-800">Activity Level</span>
                            </div>
                            <p className="text-purple-700">
                              {userActivity.totalMinted} minted • {userActivity.totalTransactions} transactions
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Performance */}
                    {userNFTs.length > 0 && (
                      <div className="bg-white rounded-lg p-6 border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Top Performing NFTs</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Title</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-left py-2">Views</th>
                                <th className="text-left py-2">Likes</th>
                                <th className="text-left py-2">Earnings</th>
                                <th className="text-left py-2">Royalty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userNFTs
                                .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
                                .slice(0, 5)
                                .map((nft) => (
                                <tr key={nft.id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 font-medium">{nft.title}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${getContentTypeColor(nft.contentType)}`}>
                                      {nft.contentType}
                                    </span>
                                  </td>
                                  <td className="py-3">{nft.views}</td>
                                  <td className="py-3">{nft.likes}</td>
                                  <td className="py-3 text-green-600 font-semibold">{nft.totalEarnings} ETH</td>
                                  <td className="py-3">{nft.royaltyPercentage}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Networks Tab */}
                {activeTab === 'networks' && (
                  <div>
                    <NetworkSelector />
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