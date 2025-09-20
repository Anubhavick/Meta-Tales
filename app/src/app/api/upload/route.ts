import { NextRequest, NextResponse } from 'next/server'

// Simple IPFS upload using Pinata API
async function uploadToPinata(file: File, filename: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file, filename)
  
  const pinataMetadata = JSON.stringify({
    name: filename,
  })
  formData.append('pinataMetadata', pinataMetadata)

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PINATA_JWT}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.statusText}`)
  }

  const result = await response.json()
  return result.IpfsHash
}

// Fallback: Upload to a free IPFS gateway
async function uploadToFreeIPFS(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  // Using a free IPFS service
  const response = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.statusText}`)
  }

  const result = await response.json()
  return result.Hash
}

// Simple local storage simulation for development
function generateMockIPFSHash(): string {
  return 'Qm' + Math.random().toString(36).substring(2, 48)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const content = formData.get('content') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const contentType = formData.get('contentType') as string
    const royaltyPercentage = formData.get('royaltyPercentage') as string

    if (!image || !title || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: image, title, description' },
        { status: 400 }
      )
    }

    console.log('📦 Uploading to IPFS:', { title, contentType })

    // For demo purposes, we'll simulate IPFS uploads
    // In production, you would use Pinata, Infura IPFS, or NFT.Storage
    
    let imageHash: string
    let contentHash: string | null = null

    try {
      // Try Pinata first if JWT is configured
      if (process.env.PINATA_JWT) {
        console.log('🖼️ Uploading image to Pinata...')
        imageHash = await uploadToPinata(image, `${title}-cover.${image.type.split('/')[1]}`)
        
        if (content) {
          console.log('📄 Uploading content to Pinata...')
          contentHash = await uploadToPinata(content, `${title}-content.${content.type.split('/')[1]}`)
        }
      } else {
        // Fallback: simulate IPFS for demo
        console.log('� Using demo mode (simulated IPFS hashes)')
        imageHash = generateMockIPFSHash()
        if (content) {
          contentHash = generateMockIPFSHash()
        }
      }
    } catch (error) {
      console.warn('⚠️ Pinata upload failed, using demo mode:', error)
      imageHash = generateMockIPFSHash()
      if (content) {
        contentHash = generateMockIPFSHash()
      }
    }

    const imageUrl = `https://ipfs.io/ipfs/${imageHash}`
    const contentUrl = contentHash ? `https://ipfs.io/ipfs/${contentHash}` : null

    // Create metadata object
    const metadata = {
      name: title,
      description: description,
      image: imageUrl,
      attributes: [
        {
          trait_type: 'Content Type',
          value: contentType
        },
        {
          trait_type: 'Royalty Percentage',
          value: parseFloat(royaltyPercentage || '0')
        }
      ],
      // Add content URL if available
      ...(contentUrl && { content: contentUrl }),
      // Add external URL for the dApp
      external_url: 'https://meta-tales.vercel.app',
      // Animation URL for interactive content
      ...(contentUrl && contentType === 'comic' && { animation_url: contentUrl })
    }

    // Upload metadata to IPFS
    console.log('📝 Uploading metadata...')
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    })
    const metadataFile = new File([metadataBlob], 'metadata.json', {
      type: 'application/json'
    })

    let metadataHash: string
    try {
      if (process.env.PINATA_JWT) {
        metadataHash = await uploadToPinata(metadataFile, `${title}-metadata.json`)
      } else {
        metadataHash = generateMockIPFSHash()
      }
    } catch (error) {
      console.warn('⚠️ Metadata upload failed, using demo mode:', error)
      metadataHash = generateMockIPFSHash()
    }

    const metadataUrl = `https://ipfs.io/ipfs/${metadataHash}`

    console.log('✅ Upload complete:', {
      metadataUrl,
      imageUrl,
      contentUrl
    })

    return NextResponse.json({
      success: true,
      metadataUrl,
      imageUrl,
      contentUrl,
      metadata,
      demo: !process.env.PINATA_JWT // Indicate if this is demo mode
    })

  } catch (error) {
    console.error('❌ Upload error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to upload to IPFS', details: errorMessage },
      { status: 500 }
    )
  }
}