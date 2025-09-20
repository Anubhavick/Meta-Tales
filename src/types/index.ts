export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: {
    trait_type: string
    value: string | number
  }[]
  content: {
    type: 'story' | 'poem' | 'comic'
    text?: string
    pages?: string[] // For comics
    wordCount?: number
    genre?: string
    language?: string
  }
}

export interface CreatedNFT {
  tokenId: string
  creator: string
  owner: string
  tokenURI: string
  metadata: NFTMetadata
  royaltyPercentage: number
  mintedAt: Date
  transactionHash: string
}

export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export interface IPFSUploadResult {
  hash: string
  url: string
  size: number
}

export interface CreateNFTForm {
  title: string
  description: string
  content: string
  contentType: 'story' | 'poem' | 'comic'
  genre: string
  language: string
  royaltyPercentage: number
  coverImage?: File
  additionalImages?: File[] // For comics
}

export interface MarketplaceNFT extends CreatedNFT {
  price?: string
  isForSale: boolean
  lastSalePrice?: string
  views: number
  likes: number
}

export interface TransactionStatus {
  hash: string
  status: 'pending' | 'confirmed' | 'failed'
  confirmations: number
  gasUsed?: string
  blockNumber?: number
}