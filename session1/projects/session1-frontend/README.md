# Simple NFT Marketplace Frontend

A modern, responsive frontend for the Simple NFT smart contract on Algorand. Built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **Wallet Integration** - Connect with Pera, Defly, Exodus, and KMD wallets
- ✅ **NFT Minting** - Mint new NFTs (minter only)
- ✅ **NFT Transfers** - Transfer NFTs between accounts
- ✅ **NFT Burning** - Burn/destroy NFTs (owner only)
- ✅ **Modern UI** - Clean, responsive design with Tailwind CSS
- ✅ **Real-time Updates** - Live NFT data fetching from smart contract
- ✅ **Transaction Notifications** - Toast notifications for all actions
- ✅ **Network Support** - Works on TestNet, MainNet, and LocalNet

## Smart Contract Functions

The frontend integrates with the following smart contract methods:

- `initialize(name, symbol, uri, minter)` - Initialize the contract
- `mint(to, metadata)` - Mint a new NFT
- `burn(token_id)` - Burn/destroy an NFT
- `transfer(to, token_id)` - Transfer NFT to another account
- `balance_of(account)` - Check NFT balance of an account
- `owner_of(token_id)` - Get the owner of an NFT
- `get_name()`, `get_symbol()`, `get_uri()` - Get contract metadata
- `get_total_supply()` - Get total NFT supply

## Prerequisites

- Node.js 18+ and pnpm
- Algorand wallet (Pera, Defly, or Exodus)
- Deployed SimpleNFT smart contract
- ALGO tokens for transaction fees

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd session1-frontend
   pnpm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update:
   - `VITE_CONTRACT_APP_ID` - Your deployed contract app ID
   - `VITE_CONTRACT_APP_ADDRESS` - Your contract address
   - Network settings for TestNet/MainNet/LocalNet

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CONTRACT_APP_ID` | Your smart contract application ID | `123456789` |
| `VITE_CONTRACT_APP_ADDRESS` | Your contract address | `""` |
| `VITE_ALGOD_NETWORK` | Network to use (`testnet`/`mainnet`/`localnet`) | `testnet` |

### Wallet Setup

1. **Install Wallet App**
   - Pera Wallet: https://perawallet.app/
   - Defly Wallet: https://defly.app/
   - Exodus: https://www.exodus.com/

2. **Fund Your Wallet**
   - Get TestNet ALGO from the [Algorand faucet](https://bank.testnet.algorand.network/)
   - Minimum balance: 0.1 ALGO + transaction fees

3. **Connect to Marketplace**
   - Click "Connect Wallet" in the app
   - Select your preferred wallet
   - Approve the connection request

## Smart Contract Deployment

Before using the frontend, deploy your smart contract:

1. **Deploy Contract**
   ```bash
   # Navigate to contracts directory
   cd ../session1-contracts

   # Deploy using AlgoKit
   algokit deploy session1
   ```

2. **Update Frontend Config**
   - Copy the deployed app ID and address
   - Update `.env` with your contract details
   - Restart the development server

## Usage Guide

### For Minters

1. Connect your wallet (must be the designated minter)
2. Click "Mint NFT" in the sidebar
3. Enter recipient address (defaults to your address)
4. Add NFT metadata/description
5. Confirm and approve the transaction

### For NFT Owners

1. **Transfer NFT**
   - Click "Transfer NFT"
   - Enter recipient address
   - Confirm the transfer

2. **Burn NFT**
   - Click "Burn NFT" (permanent action)
   - Type "BURN" to confirm
   - Approve the burning transaction

### For Viewers

- View NFT details without connecting wallet
- See current owner and metadata
- Check contract information

## Project Structure

```
src/
├── components/          # React components
│   ├── ConnectWallet.tsx
│   ├── NFTCard.tsx
│   ├── MintModal.tsx
│   ├── TransferModal.tsx
│   └── BurnModal.tsx
├── constants/          # Configuration constants
│   ├── contract.ts
│   └── wallet.ts
├── utils/              # Utility functions
│   ├── contract.ts     # Contract interaction utilities
│   └── network/        # Network configuration
└── styles/             # CSS and styling
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm generate:app-clients` - Generate contract clients

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- React functional components with hooks
- Lucide React for icons

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

1. Build the project: `pnpm build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables
4. Ensure HTTPS is enabled (required for wallet connections)

## Troubleshooting

### Common Issues

1. **"Wallet not connected"**
   - Install and unlock your wallet app
   - Ensure wallet is on the correct network (TestNet/MainNet)
   - Try reconnecting in the app

2. **"Transaction failed"**
   - Check your ALGO balance (minimum 0.1 ALGO)
   - Verify contract address is correct
   - Check network connectivity

3. **"Contract not found"**
   - Update `VITE_CONTRACT_APP_ID` in `.env`
   - Ensure contract is deployed on the correct network
   - Restart the development server

### Getting Help

- Check the browser console for detailed error messages
- Verify environment variables are correctly set
- Ensure smart contract is deployed and accessible
- Join the Algorand Discord for community support

## Security Notes

- Never share your private keys or mnemonic phrases
- Always verify transaction details before approving
- Use TestNet for development and testing
- Keep your wallet app updated to the latest version
- Be cautious of phishing attempts and fake websites

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
