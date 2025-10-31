import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { X, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { burnNFT, isNFTOwner } from '../utils/contract'
import toast from 'react-hot-toast'

interface BurnModalProps {
  openModal: boolean
  setModalState: (state: boolean) => void
}

export const BurnModal: React.FC<BurnModalProps> = ({ openModal, setModalState }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const [tokenId, setTokenId] = useState(1)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [confirmText, setConfirmText] = useState('')

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

    if (confirmText !== 'BURN') {
      toast.error('Please type "BURN" to confirm')
      return
    }

    setLoading(true)

    try {
      const signer = {
        addr: activeAddress,
        signer: transactionSigner,
      }

      await burnNFT(signer, tokenId)

      // Reset form and close modal
      setConfirmText('')
      setTokenId(1)
      setModalState(false)

      // Refresh the page to show the burned NFT
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error('Burn error:', error)
      toast.error('Failed to burn NFT. Please check your wallet balance and try again.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    if (!loading) {
      setModalState(false)
      setConfirmText('')
      setTokenId(1)
    }
  }

  if (!mounted) return null

  if (!openModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-red-600 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Burn NFT
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
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Ownership Required</h4>
                  <p className="text-sm text-yellow-700">
                    Only the current NFT owner can burn this NFT. Please verify you own the NFT.
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
                    You are the current owner of this NFT and can burn it.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!activeAddress && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Wallet Not Connected</h4>
                  <p className="text-sm text-red-700">
                    Please connect your wallet to burn NFTs.
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={loading || !activeAddress}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The ID of the NFT you want to burn
              </p>
            </div>

            {/* Critical Warning */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-2">⚠️ Critical Warning</h4>
                  <div className="text-sm text-red-700 space-y-1">
                    <p><strong>This action is irreversible and permanent.</strong></p>
                    <p>• Burning will destroy the NFT forever</p>
                    <p>• The NFT will be removed from circulation</p>
                    <p>• No one will be able to recover this NFT</p>
                    <p>• All metadata and ownership records will be lost</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Type "BURN" to confirm
              </label>
              <input
                type="text"
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type BURN in all caps"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                disabled={loading || !activeAddress}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This confirms you understand the permanent consequences
              </p>
            </div>

            {/* Fee Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Burn Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Network fee will be deducted from your account</p>
                <p>• The burn action is irreversible once confirmed</p>
                <p>• Only the current owner can burn the NFT</p>
                <p>• Total supply will be reduced by 1</p>
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
              disabled={loading || !activeAddress || !isOwner || confirmText !== 'BURN'}
              className="btn-destructive px-6 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Burning...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Burn NFT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}