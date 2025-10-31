import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { X, Send, AlertCircle, CheckCircle } from 'lucide-react'
import { transferNFT, isNFTOwner } from '../utils/contract'
import toast from 'react-hot-toast'

interface TransferModalProps {
  openModal: boolean
  setModalState: (state: boolean) => void
}

export const TransferModal: React.FC<TransferModalProps> = ({ openModal, setModalState }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [tokenId, setTokenId] = useState(1)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkOwnership = async () => {
      if (activeAddress && openModal) {
        try {
          const isNFTOwnerAccount = await isNFTOwner(activeAddress)
          setIsOwner(isNFTOwnerAccount)
        } catch (error) {
          console.error('Error checking NFT ownership:', error)
        }
      }
    }

    checkOwnership()
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

    if (recipientAddress.trim() === activeAddress) {
      toast.error('Cannot transfer to your own address')
      return
    }

    setLoading(true)

    try {
      const signer = {
        addr: activeAddress,
        signer: transactionSigner,
      }

      await transferNFT(signer, recipientAddress.trim(), tokenId)

      // Reset form and close modal
      setRecipientAddress('')
      setTokenId(1)
      setModalState(false)

      // Refresh the page to show updated NFT ownership
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error('Transfer error:', error)
      toast.error('Failed to transfer NFT. Please check your wallet balance and try again.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    if (!loading) {
      setModalState(false)
      setRecipientAddress('')
      setTokenId(1)
    }
  }

  if (!mounted) return null

  if (!openModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-600" />
            Transfer NFT
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
          {/* Owner Status Check */}
          {!isOwner && activeAddress && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Ownership Required</h4>
                  <p className="text-sm text-yellow-700">
                    Only the current NFT owner can transfer this NFT. Please verify you own the NFT.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message for Owner */}
          {isOwner && activeAddress && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">NFT Owner Confirmed</h4>
                  <p className="text-sm text-green-700">
                    You are the current owner of this NFT and can transfer it.
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
                    Please connect your wallet to transfer NFTs.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Token ID */}
            <div>
              <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-2">
                Token ID
              </label>
              <input
                type="number"
                id="tokenId"
                value={tokenId}
                onChange={(e) => setTokenId(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                disabled={loading || !activeAddress}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The ID of the NFT you want to transfer
              </p>
            </div>

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
                The address that will receive the NFT
              </p>
            </div>

            {/* Fee Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Transfer Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Network fee will be deducted from your account</p>
                <p>• The transfer is irreversible once confirmed</p>
                <p>• Only the current owner can transfer the NFT</p>
                <p>• Recipient will become the new owner</p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">Important Notice</h4>
                  <p className="text-sm text-orange-700">
                    Double-check the recipient address before transferring. NFT transfers cannot be undone.
                  </p>
                </div>
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
              disabled={loading || !activeAddress || !isOwner}
              className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Transferring...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Transfer NFT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}