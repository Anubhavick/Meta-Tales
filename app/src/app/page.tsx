import { Navigation } from '@/components/Navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meta-Tales: Literary NFT Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your stories, poems, and comics into NFTs
          </p>
          <div className="space-x-4">
            <a 
              href="/mint"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Start Creating
            </a>
            <a 
              href="/gallery"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Explore Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
