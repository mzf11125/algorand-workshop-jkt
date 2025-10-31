// Contract configuration
// These values need to be updated after deploying your smart contract

export const CONTRACT_CONFIG = {
  // Replace with your actual deployed contract app ID
  appId: Number(import.meta.env.VITE_CONTRACT_APP_ID) || 123456789,

  // Replace with your actual contract app address (will be calculated after deployment)
  appAddress: import.meta.env.VITE_CONTRACT_APP_ADDRESS || '',

  // Contract ABI methods
  methods: {
    initialize: 'initialize',
    mint: 'mint',
    burn: 'burn',
    transfer: 'transfer',
    transferFrom: 'transferFrom',
    balanceOf: 'balanceOf',
    ownerOf: 'ownerOf',
    getName: 'get_name',
    getSymbol: 'get_symbol',
    getUri: 'get_uri',
    getTotalSupply: 'get_total_supply',
    setMinter: 'set_minter',
    getCurrentTokenId: 'get_current_token_id',
    exists: 'exists'
  }
}

// Default NFT metadata (used when no NFT exists)
export const DEFAULT_NFT_METADATA = {
  name: "SimpleNFT",
  symbol: "SNFT",
  description: "A simple NFT minted on Algorand",
  image: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=NFT",
  external_url: "",
  attributes: [
    {
      trait_type: "Platform",
      value: "Algorand"
    },
    {
      trait_type: "Standard",
      value: "ARC-4"
    }
  ]
}

// Network configuration
export const NETWORK_CONFIG = {
  TESTNET: {
    name: 'TestNet',
    algodServer: 'https://testnet-api.algonode.cloud',
    algodPort: '',
    algodToken: '',
    indexerServer: 'https://testnet-idx.algonode.cloud',
    indexerPort: '',
    indexerToken: ''
  },
  MAINNET: {
    name: 'MainNet',
    algodServer: 'https://mainnet-api.algonode.cloud',
    algodPort: '',
    algodToken: '',
    indexerServer: 'https://mainnet-idx.algonode.cloud',
    indexerPort: '',
    indexerToken: ''
  },
  LOCALNET: {
    name: 'LocalNet',
    algodServer: 'http://localhost',
    algodPort: '4001',
    algodToken: 'a'.repeat(64),
    indexerServer: 'http://localhost',
    indexerPort: '8980',
    indexerToken: ''
  }
}

// Transaction fees and limits
export const TRANSACTION_FEES = {
  MIN_FEE: 1000, // 0.001 ALGO in microAlgos
  APP_CALL_FEE: 1000,
  ASSET_OPT_IN_FEE: 100000, // 0.1 ALGO
  ASSET_CREATE_FEE: 100000, // 0.1 ALGO

  // Minimum balance requirements
  MIN_ACCOUNT_BALANCE: 100000, // 0.1 ALGO
  MIN_APP_BALANCE: 100000, // 0.1 ALGO per app
  MIN_ASSET_BALANCE: 100000, // 0.1 ALGO per asset
}

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete this transaction',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  CONTRACT_NOT_FOUND: 'Contract not found. Please check the app ID.',
  NOT_AUTHORIZED: 'You are not authorized to perform this action',
  INVALID_TOKEN_ID: 'Invalid token ID',
  NFT_NOT_EXISTS: 'NFT does not exist',
  ALREADY_MINTED: 'NFT has already been minted',
  INVALID_ADDRESS: 'Invalid recipient address',
  SAME_ADDRESS: 'Cannot transfer to the same address'
}

// Success messages
export const SUCCESS_MESSAGES = {
  NFT_MINTED: 'NFT minted successfully!',
  NFT_TRANSFERRED: 'NFT transferred successfully!',
  NFT_BURNED: 'NFT burned successfully!',
  WALLET_CONNECTED: 'Wallet connected successfully!',
  TRANSACTION_SENT: 'Transaction sent successfully!'
}