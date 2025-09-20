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

  // Calculate stats from user NFTs and MetaMask history
  const totalNFTs = userNFTs.length
  const totalEarnings = userNFTs.reduce((sum, nft) => sum + parseFloat(nft.totalEarnings || '0'), 0)
  const totalViews = userNFTs.reduce((sum, nft) => sum + (nft.views || 0), 0)
  const totalLikes = userNFTs.reduce((sum, nft) => sum + (nft.likes || 0), 0)

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
        ) : !isHardhatNetwork ? (
          <div className="max-w-2xl mx-auto">
            <AddHardhatNetworkButton />
          </div>
        ) : (
          <>
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                    <p className="text-sm font-medium text-gray-600">Minted</p>
                    <div className="text-2xl font-bold text-gray-900">{userActivity.totalMinted}</div>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <div className="text-2xl font-bold text-gray-900">{userActivity.totalTransactions}</div>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gas Spent</p>
                    <div className="text-2xl font-bold text-gray-900">{parseFloat(userActivity.totalGasSpent).toFixed(4)}</div>
                    <div className="text-xs text-gray-500">ETH</div>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Likes</p>
                    <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
                  </div>
                  <div className="h-12 w-12 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-pink-600" />
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

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Minted:</span>
                          <span className="font-semibold">{userActivity.totalMinted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Received:</span>
                          <span className="font-semibold">{userActivity.totalReceived}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Sent:</span>
                          <span className="font-semibold">{userActivity.totalSent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Transactions:</span>
                          <span className="font-semibold">{userActivity.totalTransactions}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Usage</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Network:</span>
                          <span className="font-semibold">{currentNetwork}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Gas Spent:</span>
                          <span className="font-semibold">{parseFloat(userActivity.totalGasSpent).toFixed(6)} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Gas per Tx:</span>
                          <span className="font-semibold">
                            {userActivity.totalTransactions > 0 
                              ? (parseFloat(userActivity.totalGasSpent) / userActivity.totalTransactions).toFixed(6)
                              : '0'} ETH
                          </span>
                        </div>
                      </div>
                    </div>
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