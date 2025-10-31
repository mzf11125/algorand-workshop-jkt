import React from 'react'
import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import { X, Wallet as WalletIcon, LogOut } from 'lucide-react'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet: React.FC<ConnectWalletInterface> = ({ openModal, closeModal }) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

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
    closeModal()
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (!openModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
          </h3>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {activeAddress ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Connected</p>
                    <p className="text-sm font-mono text-green-700">
                      {formatAddress(activeAddress)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Network Information</h4>
                <p className="text-sm text-blue-700">
                  You are connected to the Algorand network and can now interact with the NFT marketplace.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Choose your preferred wallet to connect to the marketplace
              </p>

              <div className="space-y-3">
                {wallets?.map((wallet) => (
                  <button
                    key={`provider-${wallet.id}`}
                    data-test-id={`${wallet.id}-connect`}
                    onClick={() => wallet.connect()}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    {!isKmd(wallet) && (
                      <img
                        alt={`wallet_icon_${wallet.id}`}
                        src={wallet.metadata.icon}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">
                        {isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {isKmd(wallet) ? 'Development wallet' : wallet.metadata.name}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="btn-secondary px-6 py-2"
          >
            {activeAddress ? 'Close' : 'Cancel'}
          </button>

          {activeAddress && (
            <button
              onClick={handleDisconnect}
              data-test-id="logout"
              className="btn-destructive px-6 py-2 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectWallet
