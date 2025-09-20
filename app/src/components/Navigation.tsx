'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BookOpen, Home, Palette, User, Plus } from 'lucide-react'

export function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              href="/mint" 
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Mint NFT</span>
            </Link>
            
            <Link 
              href="/gallery" 
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Palette className="h-4 w-4" />
              <span>Gallery</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
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
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="flex justify-around py-2">
          <Link 
            href="/" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link 
            href="/mint" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Mint</span>
          </Link>
          
          <Link 
            href="/gallery" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600"
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs mt-1">Gallery</span>
          </Link>
          
          <Link 
            href="/dashboard" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-indigo-600"
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}