'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BookOpen, Home, Palette, User, Plus } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
      <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl">
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Meta-Tales</span>
            </Link>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/mint" 
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Mint NFT</span>
            </Link>
            
            <Link 
              href="/gallery" 
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <Palette className="h-4 w-4" />
              <span>Gallery</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors font-medium"
            >
              <User className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Connect wallet button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden mt-2">
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl">
          <div className="flex justify-around py-3">
            <Link 
              href="/" 
              className="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Home</span>
            </Link>
            
            <Link 
              href="/mint" 
              className="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Mint</span>
            </Link>
            
            <Link 
              href="/gallery" 
              className="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <Palette className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Gallery</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex flex-col items-center p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <User className="h-5 w-5" />
              <span className="text-xs mt-1 font-medium">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}