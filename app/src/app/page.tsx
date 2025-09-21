import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { BookOpen, Sparkles, TrendingUp, Users, ArrowRight, Star, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              The Future of Literary NFTs
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Stories</span>
              <br />
              Into Digital Assets
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create, mint, and trade literary NFTs with built-in royalties. 
              Join the revolution where creativity meets blockchain technology.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a 
                href="/mint"
                className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center font-semibold text-lg shadow-xl"
              >
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="/gallery"
                className="group bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center font-semibold text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Gallery
              </a>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">1,000+</div>
                <div className="text-gray-300">Literary NFTs Created</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">50+</div>
                <div className="text-gray-300">Active Creators</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-2">25 ETH</div>
                <div className="text-gray-300">Total Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Meta-Tales?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the premier platform for literary creators to tokenize their work and earn ongoing royalties.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Enhancement</h3>
              <p className="text-gray-600">
                Improve your content with our built-in AI tools for grammar correction, content enhancement, and title generation.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Built-in Royalties</h3>
              <p className="text-gray-600">
                Earn automatically from every future sale of your NFT. Set your royalty percentage and watch your earnings grow.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure & Decentralized</h3>
              <p className="text-gray-600">
                Your content is stored on IPFS and secured by blockchain technology. True ownership, forever.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Mint Your First Literary NFT?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of creators who are already building their digital literary legacy.
          </p>
          <a 
            href="/mint"
            className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors font-semibold text-lg shadow-xl"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
