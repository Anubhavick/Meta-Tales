/**
 * Add Hardhat network to MetaMask programmatically
 */
export async function addHardhatNetwork() {
  if (!window.ethereum) {
    alert('MetaMask is not installed!')
    return false
  }

  try {
    // Request to add the Hardhat network
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x7A69', // 31337 in hex
          chainName: 'Hardhat Localhost',
          rpcUrls: ['http://127.0.0.1:8545'],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
          blockExplorerUrls: null,
        },
      ],
    })
    
    console.log('✅ Hardhat network added to MetaMask!')
    return true
  } catch (error: any) {
    if (error.code === 4902) {
      console.log('Hardhat network is already added to MetaMask')
      return true
    } else {
      console.error('❌ Failed to add Hardhat network:', error)
      return false
    }
  }
}

/**
 * Switch to Hardhat network in MetaMask
 */
export async function switchToHardhatNetwork() {
  if (!window.ethereum) {
    alert('MetaMask is not installed!')
    return false
  }

  try {
    // Try to switch to Hardhat network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x7A69' }], // 31337 in hex
    })
    
    console.log('✅ Switched to Hardhat network!')
    return true
  } catch (error: any) {
    if (error.code === 4902) {
      // Network doesn't exist, add it first
      console.log('Hardhat network not found, adding it...')
      return await addHardhatNetwork()
    } else {
      console.error('❌ Failed to switch to Hardhat network:', error)
      return false
    }
  }
}

// Network details for manual addition
export const HARDHAT_NETWORK_DETAILS = {
  networkName: 'Hardhat Localhost',
  rpcUrl: 'http://127.0.0.1:8545',
  chainId: '31337',
  chainIdHex: '0x7A69',
  currencySymbol: 'ETH',
  blockExplorer: '', // Empty for local network
}