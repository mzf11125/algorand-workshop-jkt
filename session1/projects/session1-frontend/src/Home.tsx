import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { Wallet, Image, Plus, Send, Trash2, Copy, Check, LogOut } from 'lucide-react'
import ConnectWallet from './components/ConnectWallet'
import { NFTCard } from './components/NFTCard'
import { MintModal } from './components/MintModal'
import { TransferModal } from './components/TransferModal'
import { BurnModal } from './components/BurnModal'
import toast from 'react-hot-toast'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [mintModal, setMintModal] = useState<boolean>(false)
  const [transferModal, setTransferModal] = useState<boolean>(false)
  const [burnModal, setBurnModal] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  const { activeAddress, activeAccount, wallets } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const handleDisconnect = async () => {
    if (wallets) {
      const activeWallet = wallets.find((w) => w.isActive)
      if (activeWallet) {
        await activeWallet.disconnect()
      } else {
        localStorage.removeItem('@txnlab/use-wallet:v3')
        window.location.reload()
      }
    }
  }

  const copyAddress = () => {
    if (activeAddress) {
      navigator.clipboard.writeText(activeAddress)
      setCopied(true)
      toast.success('Address copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Simple NFT Marketplace
                </h1>
                <p className="text-gray-600">
                  Mint, transfer, and manage your NFTs on Algorand
                </p>
              </div>

              <div className="flex items-center gap-4">
                {activeAddress ? (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Connected</p>
                      <p className="font-mono text-gray-900">
                        {formatAddress(activeAddress)}
                      </p>
                    </div>
                    <button
                      onClick={copyAddress}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copy address"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Disconnect wallet"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleWalletModal}
                    className="btn-primary px-6 py-3 flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          {activeAddress ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Actions */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    NFT Actions
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => setMintModal(true)}
                      className="w-full btn-primary justify-start gap-3 py-3"
                    >
                      <Plus className="w-4 h-4" />
                      Mint NFT
                    </button>

                    <button
                      onClick={() => setTransferModal(true)}
                      className="w-full btn-secondary justify-start gap-3 py-3"
                    >
                      <Send className="w-4 h-4" />
                      Transfer NFT
                    </button>

                    <button
                      onClick={() => setBurnModal(true)}
                      className="w-full btn-destructive justify-start gap-3 py-3"
                    >
                      <Trash2 className="w-4 h-4" />
                      Burn NFT
                    </button>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Contract Info</h3>
                    <p className="text-sm text-blue-700">
                      This marketplace uses a simple NFT contract that supports single NFT minting, transfers, and burning operations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Content - NFT Display */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Your NFT Collection
                  </h2>

                  <NFTCard />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your Algorand wallet to start minting, trading, and managing NFTs on the marketplace.
              </p>
              <button
                onClick={toggleWalletModal}
                className="btn-primary px-8 py-3 flex items-center gap-2 mx-auto"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <MintModal openModal={mintModal} setModalState={setMintModal} />
      <TransferModal openModal={transferModal} setModalState={setTransferModal} />
      <BurnModal openModal={burnModal} setModalState={setBurnModal} />
    </div>
  )
}

export default Home
