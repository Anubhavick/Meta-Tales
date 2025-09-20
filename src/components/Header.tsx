import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { WalletButton } from './WalletButton'

export function Header() {
  return (
    <header className="border-b border-white/10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-accent" />
            <h1 className="text-2xl font-bold gradient-bg bg-clip-text text-transparent">
              Meta Tales
            </h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/marketplace" className="hover:text-accent transition-colors">
              Marketplace
            </Link>
            <Link href="/create" className="hover:text-accent transition-colors">
              Create
            </Link>
            <Link href="/my-nfts" className="hover:text-accent transition-colors">
              My NFTs
            </Link>
          </nav>
          <WalletButton />
        </div>
      </div>
    </header>
  )
}