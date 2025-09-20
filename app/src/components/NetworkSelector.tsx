'use client'

import { useState } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { hardhat, goerli, sepolia, polygonMumbai, optimismGoerli, arbitrumGoerli, bscTestnet } from 'wagmi/chains'
import { Wifi, WifiOff, ExternalLink, Zap, Clock, DollarSign, RefreshCw } from 'lucide-react'
import contractsConfig from '@/config/contracts.json'

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
  [goerli.id]: {
    chain: goerli,
    name: 'Goerli Testnet',
    description: 'Most stable Ethereum testnet with reliable faucets',
    faucet: 'https://goerlifaucet.com/',
    explorer: 'https://goerli.etherscan.io',
    currency: 'ETH',
    gasPrice: 'Free',
    speed: 'Fast',
    pros: ['Stable & reliable', 'Multiple faucets', 'Close to mainnet', 'Wide support'],
    cons: ['Faucet limits', 'May have queues'],
    difficulty: 'Easy'
  },
  [polygonMumbai.id]: {
    chain: polygonMumbai,
    name: 'Mumbai Testnet',
    description: 'Polygon testnet with fast, cheap transactions',
    faucet: 'https://faucet.polygon.technology/',
    explorer: 'https://mumbai.polygonscan.com',
    currency: 'MATIC',
    gasPrice: 'Very Low',
    speed: 'Very Fast',
    pros: ['Extremely fast', 'Very cheap', 'Great faucets', 'L2 experience'],
    cons: ['Different from Ethereum', 'MATIC instead of ETH'],
    difficulty: 'Easy'
  },
  [sepolia.id]: {
    chain: sepolia,
    name: 'Sepolia Testnet',
    description: 'Newer Ethereum testnet, replacing older testnets',
    faucet: 'https://sepoliafaucet.com/',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    gasPrice: 'Free',
    speed: 'Medium',
    pros: ['Official Ethereum testnet', 'Long-term support'],
    cons: ['Limited faucets', 'Stricter requirements', 'Newer/less stable'],
    difficulty: 'Medium'
  },
  [optimismGoerli.id]: {
    chain: optimismGoerli,
    name: 'Optimism Goerli',
    description: 'Layer 2 Ethereum testnet with lower fees',
    faucet: 'https://community.optimism.io/docs/useful-tools/faucets/',
    explorer: 'https://goerli-optimism.etherscan.io',
    currency: 'ETH',
    gasPrice: 'Very Low',
    speed: 'Fast',
    pros: ['L2 scaling', 'Low fees', 'Ethereum compatibility'],
    cons: ['More complex setup', 'Bridge required'],
    difficulty: 'Medium'
  },
  [arbitrumGoerli.id]: {
    chain: arbitrumGoerli,
    name: 'Arbitrum Goerli',
    description: 'Another Layer 2 Ethereum testnet option',
    faucet: 'https://bridge.arbitrum.io/',
    explorer: 'https://goerli.arbiscan.io',
    currency: 'ETH',
    gasPrice: 'Very Low',
    speed: 'Fast',
    pros: ['L2 scaling', 'Low fees', 'Growing ecosystem'],
    cons: ['Bridge setup', 'Learning curve'],
    difficulty: 'Medium'
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
      case goerli.id: return 'goerli'
      case sepolia.id: return 'sepolia'
      case polygonMumbai.id: return 'mumbai'
      case optimismGoerli.id: return 'optimismGoerli'
      case arbitrumGoerli.id: return 'arbitrumGoerli'
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

  const handleNetworkSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId })
    } catch (error) {
      console.error('Failed to switch network:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Network Selection</h2>
        <p className="text-gray-600">Choose the best network for your testing needs</p>
      </div>

      {/* Current Network Status */}
      {currentNetwork && (
        <div className={`p-4 rounded-lg mb-6 ${hasContract ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {hasContract ? <Wifi className="h-5 w-5 text-green-600 mr-2" /> : <WifiOff className="h-5 w-5 text-orange-600 mr-2" />}
              <span className="font-semibold text-gray-900">{currentNetwork.name}</span>
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getDifficultyColor(currentNetwork.difficulty)}`}>
                {currentNetwork.difficulty}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Chain ID: {chainId}
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2">{currentNetwork.description}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {currentNetwork.gasPrice}
            </span>
            <span className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              {currentNetwork.speed}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {currentNetwork.currency}
            </span>
          </div>
          {!hasContract && (
            <div className="mt-2 text-sm text-orange-700">
              ⚠️ No contract deployed on this network yet
            </div>
          )}
        </div>
      )}

      {/* Network Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(NETWORK_INFO).map((network) => {
          const isActive = chainId === network.chain.id
          const networkKey = getNetworkKey(network.chain.id)
          const networkHasContract = networkKey ? !!contractsConfig.networks[networkKey]?.contracts?.MetaTalesNFT?.address : false
          
          return (
            <div
              key={network.chain.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isActive 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => {
                if (!isActive) {
                  handleNetworkSwitch(network.chain.id)
                }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{network.name}</h3>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(network.difficulty)}`}>
                    {network.difficulty}
                  </span>
                  {networkHasContract && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Contract deployed"></div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{network.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{network.currency}</span>
                <span>{network.gasPrice}</span>
                <span>{network.speed}</span>
              </div>

              {/* Pros */}
              <div className="mb-2">
                <p className="text-xs font-medium text-green-700 mb-1">Pros:</p>
                <ul className="text-xs text-green-600 space-y-1">
                  {network.pros.slice(0, 2).map((pro, i) => (
                    <li key={i} className="flex items-center">
                      <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-3">
                {isActive ? (
                  <span className="text-xs text-indigo-600 font-medium">✓ Active</span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNetworkSwitch(network.chain.id)
                    }}
                    disabled={isPending}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                  >
                    {isPending ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Switch'}
                  </button>
                )}
                
                <div className="flex space-x-1">
                  {network.faucet && (
                    <a
                      href={network.faucet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                      title="Get test tokens"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DollarSign className="h-3 w-3" />
                    </a>
                  )}
                  {network.explorer && (
                    <a
                      href={network.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                      title="Block explorer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Recommendations</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>🏠 Local Development:</strong> Use Hardhat for fast, free testing</p>
          <p><strong>🌐 Public Testing:</strong> Goerli is most stable, Mumbai is fastest</p>
          <p><strong>🔗 Layer 2 Testing:</strong> Try Optimism or Arbitrum for scaling</p>
          <p><strong>⚡ Speed Priority:</strong> Mumbai or BSC Testnet for fast transactions</p>
        </div>
      </div>
    </div>
  )
}