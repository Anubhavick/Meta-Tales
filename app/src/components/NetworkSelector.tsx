'use client'

import { useState } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { hardhat, sepolia, polygonMumbai, bscTestnet } from 'wagmi/chains'
import { Wifi, WifiOff, ExternalLink, Zap, Clock, DollarSign, RefreshCw } from 'lucide-react'
import contractsConfig from '@/config/contracts.json'

// Define Polygon Amoy testnet (matches other components)
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
}

interface NetworkInfo {
  chain: any
  name: string
  description: string
  faucet?: string
  explorer?: string
  currency: string
  gasPrice: string
  speed: string
  pros: string[]
  cons: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

const NETWORK_INFO: Record<number, NetworkInfo> = {
  [hardhat.id]: {
    chain: hardhat,
    name: 'Hardhat Localhost',
    description: 'Local development blockchain running on your computer',
    currency: 'ETH',
    gasPrice: 'Free',
    speed: 'Instant',
    pros: ['Free testing', 'Instant transactions', 'Complete control', '10,000 ETH per account'],
    cons: ['Local only', 'Resets when stopped'],
    difficulty: 'Easy'
  },
  [sepolia.id]: {
    chain: sepolia,
    name: 'Sepolia Testnet',
    description: 'Reliable Ethereum testnet with active development support',
    faucet: 'https://sepoliafaucet.com/',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    gasPrice: 'Free',
    speed: 'Fast',
    pros: ['Active support', 'Reliable faucets', 'Mainnet-like', 'Wide adoption'],
    cons: ['Faucet limits', 'Gas required for complex ops'],
    difficulty: 'Easy'
  },
  [polygonMumbai.id]: {
    chain: polygonMumbai,
    name: 'Mumbai Testnet (Legacy)',
    description: 'Polygon testnet with fast, cheap transactions (being deprecated)',
    faucet: 'https://faucet.polygon.technology/',
    explorer: 'https://mumbai.polygonscan.com',
    currency: 'MATIC',
    gasPrice: 'Very Low',
    speed: 'Very Fast',
    pros: ['Extremely fast', 'Very cheap', 'Great faucets', 'L2 experience'],
    cons: ['Different from Ethereum', 'MATIC instead of ETH', 'Being deprecated'],
    difficulty: 'Easy'
  },
  [polygonAmoy.id]: {
    chain: polygonAmoy,
    name: 'Polygon Amoy Testnet',
    description: 'New Polygon testnet replacing Mumbai with POL tokens',
    faucet: 'https://faucet.polygon.technology/',
    explorer: 'https://amoy.polygonscan.com',
    currency: 'POL',
    gasPrice: 'Very Low',
    speed: 'Very Fast',
    pros: ['Latest Polygon testnet', 'Very fast', 'Very cheap', 'Modern features'],
    cons: ['Different from Ethereum', 'POL instead of ETH', 'Newer network'],
    difficulty: 'Easy'
  },
  [bscTestnet.id]: {
    chain: bscTestnet,
    name: 'BSC Testnet',
    description: 'Binance Smart Chain testnet with BNB tokens',
    faucet: 'https://testnet.binance.org/faucet-smart',
    explorer: 'https://testnet.bscscan.com',
    currency: 'BNB',
    gasPrice: 'Very Low',
    speed: 'Very Fast',
    pros: ['Very fast', 'Cheap transactions', 'Good faucet'],
    cons: ['Centralized', 'Different ecosystem'],
    difficulty: 'Easy'
  }
}

export function NetworkSelector() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null)

  const currentNetwork = NETWORK_INFO[chainId]
  
  function getNetworkKey(chainId: number): keyof typeof contractsConfig.networks | null {
    switch (chainId) {
      case hardhat.id: return 'localhost'
      case sepolia.id: return 'sepolia'
      case polygonMumbai.id: return 'mumbai'
      case polygonAmoy.id: return 'amoy'
      case bscTestnet.id: return 'bscTestnet'
      default: return null
    }
  }

  const networkKey = getNetworkKey(chainId)
  const hasContract = networkKey ? !!contractsConfig.networks[networkKey]?.contracts?.MetaTalesNFT?.address : false

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'Instant': return <Zap className="h-4 w-4 text-yellow-500" />
      case 'Very Fast': return <Zap className="h-4 w-4 text-green-500" />
      case 'Fast': return <Clock className="h-4 w-4 text-green-500" />
      case 'Medium': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getPriceIcon = (gasPrice: string) => {
    if (gasPrice === 'Free') return <DollarSign className="h-4 w-4 text-green-500" />
    if (gasPrice.includes('Very Low')) return <DollarSign className="h-4 w-4 text-green-400" />
    return <DollarSign className="h-4 w-4 text-yellow-500" />
  }

  const handleNetworkSwitch = async (targetChainId: number) => {
    setSelectedNetwork(targetChainId)
    try {
      await switchChain({ chainId: targetChainId })
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
    setSelectedNetwork(null)
  }

  const isContractDeployed = (networkChainId: number) => {
    const key = getNetworkKey(networkChainId)
    if (!key) return false
    const address = contractsConfig.networks[key]?.contracts?.MetaTalesNFT?.address
    return address && address !== 'TBD' && address.startsWith('0x')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border max-w-4xl mx-auto">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Network Selection</h2>
        <p className="text-gray-600">
          Choose the blockchain network for your Meta-Tales NFT experience
        </p>
        
        {currentNetwork && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wifi className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Currently connected to {currentNetwork.name}</p>
                  <p className="text-sm text-blue-700">{currentNetwork.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasContract ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Contract Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⚠️ Contract Not Deployed
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(NETWORK_INFO).map(([id, network]) => {
            const chainId = parseInt(id)
            const isSelected = selectedNetwork === chainId
            const isCurrent = chainId === currentNetwork?.chain?.id
            const contractDeployed = isContractDeployed(chainId)
            
            return (
              <div
                key={chainId}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50'
                    : isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => !isCurrent && handleNetworkSwitch(chainId)}
              >
                {isCurrent && (
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                      Current
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {isCurrent ? (
                      <Wifi className="h-5 w-5 text-blue-600" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-gray-400" />
                    )}
                    <h3 className="font-semibold text-gray-900">{network.name}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(network.difficulty)}`}>
                    {network.difficulty}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{network.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Currency:</span>
                    <span className="font-medium">{network.currency}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Gas Price:</span>
                    <div className="flex items-center space-x-1">
                      {getPriceIcon(network.gasPrice)}
                      <span className="font-medium">{network.gasPrice}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Speed:</span>
                    <div className="flex items-center space-x-1">
                      {getSpeedIcon(network.speed)}
                      <span className="font-medium">{network.speed}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Contract:</span>
                    <span className={`font-medium ${contractDeployed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {contractDeployed ? '✅ Deployed' : '⚠️ Not Yet'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mb-4">
                  <div>
                    <h4 className="text-xs font-medium text-green-700 mb-1">✅ Pros</h4>
                    <ul className="text-xs text-green-600 space-y-0.5">
                      {network.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-red-700 mb-1">❌ Cons</h4>
                    <ul className="text-xs text-red-600 space-y-0.5">
                      {network.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {network.faucet && (
                    <a
                      href={network.faucet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      💰 Faucet
                    </a>
                  )}
                  {network.explorer && (
                    <a
                      href={network.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔍 Explorer
                    </a>
                  )}
                </div>

                {isSelected && isPending && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <RefreshCw className="h-6 w-6 text-purple-600 animate-spin" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Hardhat:</strong> Best for local testing and development</li>
            <li>• <strong>Sepolia:</strong> Reliable Ethereum testnet for realistic testing</li>
            <li>• <strong>Amoy:</strong> Latest Polygon testnet with modern features</li>
            <li>• <strong>Mumbai:</strong> Legacy Polygon testnet (being deprecated)</li>
            <li>• <strong>BSC Testnet:</strong> Fast and cheap alternative ecosystem</li>
          </ul>
        </div>
      </div>
    </div>
  )
}