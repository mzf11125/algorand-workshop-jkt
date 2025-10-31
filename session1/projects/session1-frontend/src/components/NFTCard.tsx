import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { Image, ExternalLink, Clock, User, Tag } from 'lucide-react'
import toast from 'react-hot-toast'

interface NFTData {
  tokenId: number
  name: string
  symbol: string
  uri: string
  owner: string
  totalSupply: number
  metadata?: string
}

export const NFTCard: React.FC = () => {
  const { activeAddress } = useWallet()
  const [nftData, setNftData] = useState<NFTData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!activeAddress) return

      setLoading(true)
      setError(null)

      try {
        // Mock NFT data for now - replace with actual contract calls
        // This would involve calling the smart contract methods like:
        // - get_name()
        // - get_symbol()
        // - get_uri(tokenId)
        // - owner_of(tokenId)
        // - get_total_supply()

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data - replace with actual contract interaction
        const mockNFT: NFTData = {
          tokenId: 1,
          name: "SimpleNFT",
          symbol: "SNFT",
          uri: "https://example.com/metadata.json",
          owner: activeAddress,
          totalSupply: 1,
          metadata: "This is a beautiful NFT minted on Algorand"
        }

        setNftData(mockNFT)
      } catch (err) {
        console.error('Error fetching NFT data:', err)
        setError('Failed to load NFT data')
        toast.error('Failed to load NFT data')
      } finally {
        setLoading(false)
      }
    }

    fetchNFTData()
  }, [activeAddress])

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading NFT data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading NFT</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!nftData || nftData.totalSupply === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Image className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No NFTs Found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You haven't minted any NFTs yet. Click the "Mint NFT" button to create your first NFT.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-medium text-blue-900 mb-2">Getting Started</h4>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• Click "Mint NFT" to create a new NFT</li>
            <li>• Add metadata and description</li>
            <li>• Your NFT will appear here after minting</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* NFT Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gradient-to-br from-primary-100 to-purple-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image className="w-24 h-24 text-primary-600" />
          </div>

          {/* Token ID Badge */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
            #{nftData.tokenId}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {nftData.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {nftData.symbol}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-sm">
              <Tag className="w-3 h-3" />
              Unique
            </div>
          </div>

          {nftData.metadata && (
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              {nftData.metadata}
            </p>
          )}

          <div className="space-y-3 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                Owner
              </div>
              <span className="font-mono text-gray-900">
                {formatAddress(nftData.owner)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                Total Supply
              </div>
              <span className="text-gray-900">{nftData.totalSupply}</span>
            </div>

            {nftData.uri && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  Metadata
                </div>
                <a
                  href={nftData.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  View Metadata
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="btn-secondary justify-center py-2 text-sm">
              Transfer
            </button>
            <button className="btn-destructive justify-center py-2 text-sm">
              Burn
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">NFT Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Contract Type</p>
            <p className="font-medium">Simple NFT</p>
          </div>
          <div>
            <p className="text-gray-600">Standard</p>
            <p className="font-medium">ARC-4</p>
          </div>
        </div>
      </div>
    </div>
  )
}