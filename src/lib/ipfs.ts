import { IPFSUploadResult, NFTMetadata } from '@/types'

// IPFS configuration
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY

export class IPFSService {
  private static instance: IPFSService
  
  public static getInstance(): IPFSService {
    if (!IPFSService.instance) {
      IPFSService.instance = new IPFSService()
    }
    return IPFSService.instance
  }

  async uploadFile(file: File): Promise<IPFSUploadResult> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          uploadedAt: new Date().toISOString(),
          fileType: file.type
        }
      })
      formData.append('pinataMetadata', metadata)

      const options = JSON.stringify({
        cidVersion: 1
      })
      formData.append('pinataOptions', options)

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_API_KEY}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        hash: result.IpfsHash,
        url: `${IPFS_GATEWAY}${result.IpfsHash}`,
        size: result.PinSize
      }
    } catch (error) {
      console.error('Error uploading file to IPFS:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  async uploadJSON(data: Record<string, unknown>): Promise<IPFSUploadResult> {
    try {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const file = new File([blob], 'metadata.json', { type: 'application/json' })
      
      return await this.uploadFile(file)
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  async uploadNFTMetadata(metadata: NFTMetadata): Promise<IPFSUploadResult> {
    try {
      // Ensure the metadata follows the standard format
      const standardMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        external_url: metadata.external_url,
        attributes: metadata.attributes,
        properties: {
          content: metadata.content,
          created_by: "Meta Tales Platform",
          created_at: new Date().toISOString()
        }
      }

      return await this.uploadJSON(standardMetadata)
    } catch (error) {
      console.error('Error uploading NFT metadata:', error)
      throw new Error('Failed to upload NFT metadata')
    }
  }

  getIPFSUrl(hash: string): string {
    return `${IPFS_GATEWAY}${hash}`
  }

  async fetchFromIPFS(hash: string): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(this.getIPFSUrl(hash))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching from IPFS:', error)
      throw new Error('Failed to fetch from IPFS')
    }
  }
}

// Helper function to create metadata
export function createNFTMetadata(
  title: string,
  description: string,
  imageUrl: string,
  contentType: 'story' | 'poem' | 'comic',
  content: string | string[],
  genre?: string,
  language?: string
): NFTMetadata {
  const wordCount = typeof content === 'string' 
    ? content.split(/\s+/).length 
    : content.join(' ').split(/\s+/).length

  return {
    name: title,
    description,
    image: imageUrl,
    external_url: `${process.env.NEXT_PUBLIC_BASE_URL}/nft/`,
    attributes: [
      { trait_type: 'Content Type', value: contentType },
      { trait_type: 'Word Count', value: wordCount },
      ...(genre ? [{ trait_type: 'Genre', value: genre }] : []),
      ...(language ? [{ trait_type: 'Language', value: language }] : []),
      { trait_type: 'Created On', value: 'Meta Tales' }
    ],
    content: {
      type: contentType,
      text: typeof content === 'string' ? content : undefined,
      pages: Array.isArray(content) ? content : undefined,
      wordCount,
      genre,
      language
    }
  }
}

export const ipfsService = IPFSService.getInstance()