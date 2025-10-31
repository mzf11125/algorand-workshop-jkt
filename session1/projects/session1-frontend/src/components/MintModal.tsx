import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { X, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { mintNFT, isMinter } from '../utils/contract'
import toast from 'react-hot-toast'

interface MintModalProps {
  openModal: boolean
  setModalState: (state: boolean) => void
}

export const MintModal: React.FC<MintModalProps> = ({ openModal, setModalState }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [metadata, setMetadata] = useState('')
  const [isMinterAccount, setIsMinterAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkMinterStatus = async () => {
      if (activeAddress && openModal) {
        try {
          const isMinterUser = await isMinter(activeAddress)
          setIsMinterAccount(isMinterUser)
        } catch (error) {
          console.error('Error checking minter status:', error)
        }
      }
    }

    checkMinterStatus()
  }, [activeAddress, openModal])

  useEffect(() => {
    if (activeAddress && openModal) {
      setRecipientAddress(activeAddress)
    }
  }, [activeAddress, openModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!transactionSigner || !activeAddress) {
      toast.error('Wallet not connected')
      return
    }

    if (!recipientAddress.trim()) {
      toast.error('Please enter a recipient address')
      return
    }

    if (!metadata.trim()) {
      toast.error('Please enter metadata for the NFT')
      return
    }

    setLoading(true)

    try {
      const signer = {
        addr: activeAddress,
        signer: transactionSigner,
      }

      await mintNFT(signer, recipientAddress.trim(), metadata.trim())

      // Reset form and close modal
      setMetadata('')
      setRecipientAddress(activeAddress || '')
      setModalState(false)

      // Refresh the page to show the new NFT
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error('Mint error:', error)
      toast.error('Failed to mint NFT. Please check your wallet balance and try again.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    if (!loading) {
      setModalState(false)
      setMetadata('')
      setRecipientAddress(activeAddress || '')
    }
  }

  if (!mounted) return null

  if (!openModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" />
            Mint New NFT
          </h3>
          <button
            onClick={closeModal}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Minter Status Check */}
          {!isMinterAccount && activeAddress && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Minter Check Required</h4>
                  <p className="text-sm text-yellow-700">
                    Only the designated minter can create new NFTs. Please verify you have the correct permissions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message for Minter */}
          {isMinterAccount && activeAddress && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Minter Permissions Confirmed</h4>
                  <p className="text-sm text-green-700">
                    You have the necessary permissions to mint NFTs.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!activeAddress && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Wallet Not Connected</h4>
                  <p className="text-sm text-red-700">
                    Please connect your wallet to mint NFTs.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Recipient Address */}
            <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                id="recipient"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter Algorand address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={loading || !activeAddress}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The address that will receive the minted NFT
              </p>
            </div>

            {/* Metadata */}
            <div>
              <label htmlFor="metadata" className="block text-sm font-medium text-gray-700 mb-2">
                NFT Metadata
              </label>
              <textarea
                id="metadata"
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                placeholder="Enter NFT description, properties, or metadata"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                disabled={loading || !activeAddress}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Describe your NFT, its properties, or any relevant information
              </p>
            </div>

            {/* Fee Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Transaction Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Network fee will be deducted from your account</p>
                <p>• Only one NFT can exist per contract</p>
                <p>• The minter will be set as the initial minter</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="btn-secondary px-6 py-2 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !activeAddress || !isMinterAccount}
              className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Minting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Mint NFT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}