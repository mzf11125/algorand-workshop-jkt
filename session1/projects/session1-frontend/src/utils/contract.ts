import algosdk, { TransactionSigner } from 'algosdk'
import { getAlgodConfigFromViteEnvironment } from './network/getAlgoClientConfigs'
import toast from 'react-hot-toast'

const algodConfig = getAlgodConfigFromViteEnvironment()
const algodClient = new algosdk.Algodv2(algodConfig.token as string, algodConfig.server, algodConfig.port)

// Contract configuration - replace with your actual contract values
const CONTRACT_CONFIG = {
  appId: 748924332, // Application ID from deployed contract
  appAddress: 'JAQW3NJQA4AYUITMUPEBXKN6OTASROV3BZ3DIA453MLTHBH3YK3ATVEBQQ', // Contract application address
  approvalProgram: '', // Replace with your actual approval program
  clearProgram: '', // Replace with your actual clear program
  globalInts: 3, // Global State Uint from contract info
  globalBytes: 5, // Global State Byte from contract info
  localInts: 0, // Local State Uint from contract info
  localBytes: 0 // Local State Byte from contract info
}

export interface NFTContractMethods {
  name: string
  symbol: string
  uri: string
  totalSupply: number
  nextTokenId: number
  minter: string
  currentOwner: string
  currentTokenId: number
}

/**
 * Get contract application information
 */
export async function getApplicationInfo(appId: number) {
  try {
    const appInfo = await algodClient.getApplicationByID(appId).do()
    return appInfo
  } catch (error) {
    console.error('Error getting application info:', error)
    throw error
  }
}

/**
 * Read global state from the contract
 */
export async function readContractGlobalState(): Promise<Partial<NFTContractMethods>> {
  try {
    if (!CONTRACT_CONFIG.appId) {
      throw new Error('Contract app ID not configured')
    }

    const appInfo = await getApplicationInfo(CONTRACT_CONFIG.appId)
    const globalState = appInfo.params.globalState || []

    const state: Partial<NFTContractMethods> = {}

    globalState.forEach((item: any) => {
      const key = Buffer.from(item.key, 'base64').toString('utf-8')
      const value = item.value

      switch (key) {
        case 'token_name':
          state.name = Buffer.from(value.bytes, 'base64').toString('utf-8')
          break
        case 'token_symbol':
          state.symbol = Buffer.from(value.bytes, 'base64').toString('utf-8')
          break
        case 'token_uri':
          state.uri = Buffer.from(value.bytes, 'base64').toString('utf-8')
          break
        case 'total_supply':
          state.totalSupply = value.uint
          break
        case 'next_token_id':
          state.nextTokenId = value.uint
          break
        case 'minter':
          state.minter = algosdk.encodeAddress(Buffer.from(value.bytes, 'base64'))
          break
        case 'current_owner':
          state.currentOwner = algosdk.encodeAddress(Buffer.from(value.bytes, 'base64'))
          break
        case 'current_token_id':
          state.currentTokenId = value.uint
          break
      }
    })

    return state
  } catch (error) {
    console.error('Error reading contract global state:', error)
    throw error
  }
}

/**
 * Create a method call transaction
 */
export async function createMethodCallTxn(
  sender: string,
  appIndex: number,
  method: string,
  args: any[] = [],
  appArgs: Uint8Array[] = [],
  foreignAssets: number[] = []
): Promise<algosdk.Transaction> {
  const suggestedParams = await algodClient.getTransactionParams().do()

  const tx = algosdk.makeApplicationCallTxnFromObject({
    sender: sender,
    appIndex,
    appArgs,
    foreignAssets,
    suggestedParams,
    // Method name should be the first argument in ABI calls
    accounts: args.filter(arg => typeof arg === 'string').map(arg => arg),
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
  })

  return tx
}

/**
 * Create and sign a mint transaction
 */
export async function createMintTransaction(
  signer: { addr: string; signer: TransactionSigner },
  to: string,
  metadata: string
): Promise<Uint8Array> {
  try {
    const method = "mint"
    const appArgs = [
      new TextEncoder().encode(method),
      new TextEncoder().encode(to),
      new TextEncoder().encode(metadata)
    ]

    const tx = await createMethodCallTxn(
      signer.addr,
      CONTRACT_CONFIG.appId,
      method,
      [to, metadata],
      appArgs
    )

    // Return unsigned transaction for now
    return tx.toByte()
  } catch (error) {
    console.error('Error creating mint transaction:', error)
    throw error
  }
}

/**
 * Create and sign a transfer transaction
 */
export async function createTransferTransaction(
  signer: { addr: string; signer: TransactionSigner },
  to: string,
  tokenId: number
): Promise<Uint8Array> {
  try {
    const method = "transfer"
    const appArgs = [
      new TextEncoder().encode(method),
      new TextEncoder().encode(to),
      algosdk.encodeUint64(tokenId)
    ]

    const tx = await createMethodCallTxn(
      signer.addr,
      CONTRACT_CONFIG.appId,
      method,
      [to, tokenId],
      appArgs
    )

    // Return unsigned transaction for now
    return tx.toByte()
  } catch (error) {
    console.error('Error creating transfer transaction:', error)
    throw error
  }
}

/**
 * Create and sign a burn transaction
 */
export async function createBurnTransaction(
  signer: { addr: string; signer: TransactionSigner },
  tokenId: number
): Promise<Uint8Array> {
  try {
    const method = "burn"
    const appArgs = [
      new TextEncoder().encode(method),
      algosdk.encodeUint64(tokenId)
    ]

    const tx = await createMethodCallTxn(
      signer.addr,
      CONTRACT_CONFIG.appId,
      method,
      [tokenId],
      appArgs
    )

    // Return unsigned transaction for now
    return tx.toByte()
  } catch (error) {
    console.error('Error creating burn transaction:', error)
    throw error
  }
}

/**
 * Send a signed transaction to the network
 */
export async function sendTransaction(signedTxn: Uint8Array): Promise<string> {
  try {
    const response = await algodClient.sendRawTransaction(signedTxn).do()
    const txId = response.txid

    // Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)

    return txId
  } catch (error) {
    console.error('Error sending transaction:', error)
    throw error
  }
}

/**
 * Mint NFT - Complete flow
 */
export async function mintNFT(
  signer: { addr: string; signer: TransactionSigner },
  to: string,
  metadata: string
): Promise<string> {
  try {
    toast.loading('Creating mint transaction...')

    const signedTxn = await createMintTransaction(signer, to, metadata)

    toast.loading('Sending transaction to network...')
    const txId = await sendTransaction(signedTxn)

    toast.success(`NFT minted successfully! Transaction: ${txId}`)
    return txId
  } catch (error) {
    console.error('Mint error:', error)
    toast.error('Failed to mint NFT')
    throw error
  }
}

/**
 * Transfer NFT - Complete flow
 */
export async function transferNFT(
  signer: { addr: string; signer: TransactionSigner },
  to: string,
  tokenId: number
): Promise<string> {
  try {
    toast.loading('Creating transfer transaction...')

    const signedTxn = await createTransferTransaction(signer, to, tokenId)

    toast.loading('Sending transaction to network...')
    const txId = await sendTransaction(signedTxn)

    toast.success(`NFT transferred successfully! Transaction: ${txId}`)
    return txId
  } catch (error) {
    console.error('Transfer error:', error)
    toast.error('Failed to transfer NFT')
    throw error
  }
}

/**
 * Burn NFT - Complete flow
 */
export async function burnNFT(
  signer: { addr: string; signer: TransactionSigner },
  tokenId: number
): Promise<string> {
  try {
    toast.loading('Creating burn transaction...')

    const signedTxn = await createBurnTransaction(signer, tokenId)

    toast.loading('Sending transaction to network...')
    const txId = await sendTransaction(signedTxn)

    toast.success(`NFT burned successfully! Transaction: ${txId}`)
    return txId
  } catch (error) {
    console.error('Burn error:', error)
    toast.error('Failed to burn NFT')
    throw error
  }
}

/**
 * Get account balance of NFTs
 */
export async function getNFTBalance(accountAddress: string): Promise<number> {
  try {
    // This would call the balance_of method in the contract
    // For now, return a mock value
    return 0
  } catch (error) {
    console.error('Error getting NFT balance:', error)
    return 0
  }
}

/**
 * Check if user owns the NFT
 */
export async function isNFTOwner(accountAddress: string): Promise<boolean> {
  try {
    const contractState = await readContractGlobalState()
    return contractState.currentOwner === accountAddress && (contractState.totalSupply || 0) > 0
  } catch (error) {
    console.error('Error checking NFT ownership:', error)
    return false
  }
}

/**
 * Check if user is the minter
 */
export async function isMinter(accountAddress: string): Promise<boolean> {
  try {
    const contractState = await readContractGlobalState()
    return contractState.minter === accountAddress
  } catch (error) {
    console.error('Error checking minter status:', error)
    return false
  }
}

export default {
  readContractGlobalState,
  mintNFT,
  transferNFT,
  burnNFT,
  getNFTBalance,
  isNFTOwner,
  isMinter,
  CONTRACT_CONFIG
}