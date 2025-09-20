'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Search, Filter, BookOpen, FileText, Image, Heart, Eye } from 'lucide-react'
import { MarketplaceNFT } from '@/types'
import Link from 'next/link'

// Mock data for demonstration
const mockNFTs: MarketplaceNFT[] = [
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
    transactionHash: '0xabc123',
    price: '0.1',
    isForSale: true,
    views: 245,
    likes: 18
  },
  {
    tokenId: '2',
    creator: '0x5678...9012',
    owner: '0x5678...9012',
    tokenURI: 'ipfs://example2',
    metadata: {
      name: 'Love in the Digital Age',
      description: 'A contemporary poem about modern romance.',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
      attributes: [
        { trait_type: 'Content Type', value: 'poem' },
        { trait_type: 'Genre', value: 'Romance' },
        { trait_type: 'Word Count', value: 150 }
      ],
      content: {
        type: 'poem',
        text: 'In pixels and screens...',
        wordCount: 150,
        genre: 'Romance',
        language: 'English'
      }
    },
    royaltyPercentage: 7,
    mintedAt: new Date('2025-01-02'),
    transactionHash: '0xdef456',
    price: '0.05',
    isForSale: true,
    views: 89,
    likes: 12
  },
  {
    tokenId: '3',
    creator: '0x9012...3456',
    owner: '0x9012...3456',
    tokenURI: 'ipfs://example3',
    metadata: {
      name: 'Space Adventures',
      description: 'A thrilling comic series about intergalactic exploration.',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
      attributes: [
        { trait_type: 'Content Type', value: 'comic' },
        { trait_type: 'Genre', value: 'Sci-Fi' },
        { trait_type: 'Word Count', value: 800 }
      ],
      content: {
        type: 'comic',
        pages: ['Page 1 content...', 'Page 2 content...'],
        wordCount: 800,
        genre: 'Sci-Fi',
        language: 'English'
      }
    },
    royaltyPercentage: 6,
    mintedAt: new Date('2025-01-03'),
    transactionHash: '0x789abc',
    isForSale: false,
    views: 156,
    likes: 23
  }
]

export default function MarketplacePage() {
  const [nfts] = useState<MarketplaceNFT[]>(mockNFTs)
  const [filteredNfts, setFilteredNfts] = useState<MarketplaceNFT[]>(mockNFTs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const contentTypes = [
    { value: 'all', label: 'All Types', icon: Search },
    { value: 'story', label: 'Stories', icon: BookOpen },
    { value: 'poem', label: 'Poems', icon: FileText },
    { value: 'comic', label: 'Comics', icon: Image }
  ]

  const genres = ['all', 'Fantasy', 'Romance', 'Sci-Fi', 'Horror', 'Mystery', 'Adventure']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'most_liked', label: 'Most Liked' },
    { value: 'most_viewed', label: 'Most Viewed' }
  ]

  useEffect(() => {
    let filtered = nfts

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(nft =>
        nft.metadata.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.metadata.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(nft => nft.metadata.content.type === selectedType)
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(nft => nft.metadata.content.genre === selectedGenre)
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime()
        case 'oldest':
          return new Date(a.mintedAt).getTime() - new Date(b.mintedAt).getTime()
        case 'price_low':
          const priceA = parseFloat(a.price || '0')
          const priceB = parseFloat(b.price || '0')
          return priceA - priceB
        case 'price_high':
          const priceA2 = parseFloat(a.price || '0')
          const priceB2 = parseFloat(b.price || '0')
          return priceB2 - priceA2
        case 'most_liked':
          return b.likes - a.likes
        case 'most_viewed':
          return b.views - a.views
        default:
          return 0
      }
    })

    setFilteredNfts(filtered)
  }, [nfts, searchTerm, selectedType, selectedGenre, sortBy])

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return BookOpen
      case 'poem': return FileText
      case 'comic': return Image
      default: return BookOpen
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            NFT Marketplace
          </h1>
          <p className="text-muted text-lg">
            Discover and collect unique digital stories, poems, and comics
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted" />
            <input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary border border-white/10 rounded-lg focus:border-accent focus:outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <div className="text-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-primary border border-white/10 rounded-lg hover:border-accent transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-primary p-6 rounded-xl border border-white/10 space-y-4">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-3">Content Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {contentTypes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedType(value)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                        selectedType === value
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre and Sort */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                  >
                    {genres.map(genre => (
                      <option key={genre} value={genre}>
                        {genre === 'all' ? 'All Genres' : genre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-white/10 rounded-lg focus:border-accent focus:outline-none"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-muted">
            Showing {filteredNfts.length} of {nfts.length} NFTs
          </p>
        </div>

        {/* NFT Grid */}
        {filteredNfts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNfts.map((nft) => {
              const ContentIcon = getContentTypeIcon(nft.metadata.content.type)
              
              return (
                <Link key={nft.tokenId} href={`/nft/${nft.tokenId}`}>
                  <div className="card-hover bg-primary rounded-xl overflow-hidden cursor-pointer">
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
                      {nft.isForSale && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-green-500 px-2 py-1 rounded-full text-xs font-medium">
                            For Sale
                          </div>
                        </div>
                      )}
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

                      {/* Price and Stats */}
                      <div className="flex items-center justify-between">
                        <div>
                          {nft.price && (
                            <div className="font-semibold text-accent">
                              {nft.price} ETH
                            </div>
                          )}
                          <div className="text-xs text-muted">
                            {nft.royaltyPercentage}% royalty
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 text-muted">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span className="text-xs">{nft.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs">{nft.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}