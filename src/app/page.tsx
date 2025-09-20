import Link from 'next/link'
import { PenTool, Image, Wallet } from 'lucide-react'
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h2 className="text-6xl font-bold text-balance">
            Own Your
            <span className="gradient-bg bg-clip-text text-transparent"> Stories</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto text-balance">
            A blockchain-powered NFT marketplace for stories, poems, and comics. 
            Create, mint, and trade your digital literary works with proven ownership and royalties.
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-8">
            <Link 
              href="/create"
              className="bg-accent hover:bg-accent/80 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Start Creating
            </Link>
            <Link 
              href="/marketplace"
              className="border border-white/20 hover:border-accent px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="card-hover bg-primary p-8 rounded-xl">
            <PenTool className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-3">Create & Upload</h3>
            <p className="text-muted">
              Upload your stories, poems, and comics. Store them securely on IPFS 
              with immutable proof of creation.
            </p>
          </div>

          <div className="card-hover bg-primary p-8 rounded-xl">
            <Image className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-3">Mint as NFTs</h3>
            <p className="text-muted">
              Convert your works into NFTs with ERC-721 smart contracts. 
              Establish true digital ownership and authenticity.
            </p>
          </div>

          <div className="card-hover bg-primary p-8 rounded-xl">
            <Wallet className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold mb-3">Earn Royalties</h3>
            <p className="text-muted">
              Automatically receive royalties from secondary sales. 
              Your creative work continues to generate income.
            </p>
          </div>
        </div>

          {/* Stats Section */}
          <div className="mt-24 text-center">
            <h3 className="text-3xl font-bold mb-12">Platform Statistics</h3>
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-accent">0</div>
                <div className="text-muted mt-2">NFTs Minted</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">0</div>
                <div className="text-muted mt-2">Creators</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">0 ETH</div>
                <div className="text-muted mt-2">Volume Traded</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">0 ETH</div>
                <div className="text-muted mt-2">Royalties Paid</div>
              </div>
            </div>
          </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted">
            <p>© 2025 Meta Tales. Built with Next.js, Ethereum, and IPFS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}