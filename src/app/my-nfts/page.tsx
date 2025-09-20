'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@/components/WalletProvider'
import { Header } from '@/components/Header'
import { CreatedNFT } from '@/types'
import { BookOpen, FileText, Image, Eye, Heart, Settings, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const mockUserNFTs: CreatedNFT[] = [
  {
    tokenId: '1',
    creator: '0x1234...5678',
    owner: '0x1234...5678',
    tokenURI: 'ipfs://example1',
    metadata: {
      name: 'The Enchanted Forest',
      description: 'A magical tale of adventure and discovery in an ancient forest.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      attributes: [
        { trait_type: 'Content Type', value: 'story' },
        { trait_type: 'Genre', value: 'Fantasy' },
        { trait_type: 'Word Count', value: 2500 }
      ],
      content: {
        type: 'story',
        text: 'In a land far away...',
        wordCount: 2500,
        genre: 'Fantasy',
        language: 'English'
      }
    },
    royaltyPercentage: 5,
    mintedAt: new Date('2025-01-01'),
    transactionHash: '0xabc123'
  }
]

export default function MyNFTsPage() {
  const { address, isConnected } = useWallet()
  const [nfts, setNfts] = useState<CreatedNFT[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user's NFTs
    if (isConnected && address) {
      setTimeout(() => {
        setNfts(mockUserNFTs)
        setLoading(false)
      }, 1000)
    } else {
      setNfts([])
      setLoading(false)
    }
  }, [isConnected, address])

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return BookOpen
      case 'poem': return FileText
      case 'comic': return Image
      default: return BookOpen
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <BookOpen className="h-16 w-16 text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted mb-6">
              Please connect your wallet to view your NFTs
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My NFTs</h1>
          <p className="text-muted">Manage your created and owned NFTs</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-primary p-6 rounded-xl">
            <div className="text-2xl font-bold text-accent">{nfts.length}</div>
            <div className="text-muted">Total NFTs</div>
          </div>
          <div className="bg-primary p-6 rounded-xl">
            <div className="text-2xl font-bold text-accent">0</div>
            <div className="text-muted">For Sale</div>
          </div>
          <div className="bg-primary p-6 rounded-xl">
            <div className="text-2xl font-bold text-accent">0 ETH</div>
            <div className="text-muted">Total Earnings</div>
          </div>
          <div className="bg-primary p-6 rounded-xl">
            <div className="text-2xl font-bold text-accent">0 ETH</div>
            <div className="text-muted">Royalties Earned</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/create"
            className="bg-accent hover:bg-accent/80 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Create New NFT
          </Link>
          <button className="border border-white/20 hover:border-accent px-6 py-3 rounded-lg font-semibold transition-colors">
            Import NFT
          </button>
        </div>

        {/* NFTs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-primary rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-secondary"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-secondary rounded"></div>
                  <div className="h-3 bg-secondary rounded w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-secondary rounded w-16"></div>
                    <div className="h-6 bg-secondary rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : nfts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => {
              const ContentIcon = getContentTypeIcon(nft.metadata.content.type)
              
              return (
                <div key={nft.tokenId} className="card-hover bg-primary rounded-xl overflow-hidden">
                  {/* Image */}
                  <div className="aspect-square bg-secondary relative">
                    <img
                      src={nft.metadata.image}
                      alt={nft.metadata.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <div className="bg-black/50 px-2 py-1 rounded-full flex items-center space-x-1">
                        <ContentIcon className="h-3 w-3" />
                        <span className="text-xs capitalize">{nft.metadata.content.type}</span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <button className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 truncate">
                      {nft.metadata.name}
                    </h3>
                    <p className="text-muted text-sm mb-3 line-clamp-2">
                      {nft.metadata.description}
                    </p>

                    {/* Attributes */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {nft.metadata.attributes.slice(0, 3).map((attr, index) => (
                        <span
                          key={index}
                          className="bg-secondary px-2 py-1 rounded text-xs"
                        >
                          {attr.value}
                        </span>
                      ))}
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted">
                          Royalty: {nft.royaltyPercentage}%
                        </div>
                        <div className="text-xs text-muted">
                          Minted: {nft.mintedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-muted">
                        <button className="hover:text-accent transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="hover:text-accent transition-colors">
                          <Heart className="h-4 w-4" />
                        </button>
                        <button className="hover:text-accent transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/nft/${nft.tokenId}`}
                        className="flex-1 bg-accent hover:bg-accent/80 px-3 py-2 rounded-lg text-center text-sm font-medium transition-colors"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 border border-white/20 hover:border-accent px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        List for Sale
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
            <p className="text-muted mb-6">
              You haven&apos;t created any NFTs yet. Start by creating your first literary work!
            </p>
            <Link
              href="/create"
              className="bg-accent hover:bg-accent/80 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Create Your First NFT
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}