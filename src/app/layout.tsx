import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from '@/components/WalletProvider'

export const metadata: Metadata = {
  title: 'Meta Tales - NFT Marketplace for Stories',
  description: 'A blockchain-powered NFT marketplace for stories, poems, and comics. Create, mint, and trade your digital literary works with proven ownership and royalties.',
  keywords: ['NFT', 'blockchain', 'stories', 'poems', 'comics', 'marketplace', 'Web3'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}