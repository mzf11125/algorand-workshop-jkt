# SimpleNFT - Algorand NFT Smart Contract

A complete, production-ready NFT smart contract built on Algorand using ARC4 and PyTeal. This contract implements ERC-721-like functionality for non-fungible tokens on the Algorand blockchain.

## Features

✅ **Complete NFT Functionality**
- Mint NFTs with metadata
- Transfer NFTs between accounts
- Burn NFTs (destroy)
- Ownership tracking

✅ **Security & Validation**
- Role-based access control (minter-only operations)
- Input validation and error handling
- Protection against invalid operations

✅ **Standards Compliant**
- ARC4 (Application Binary Interface) compatible
- ERC-721-like functionality adapted for Algorand
- Proper metadata support

✅ **Production Ready**
- Comprehensive test coverage
- Clean, well-documented code
- Gas-efficient operations

## Contract Architecture

### Core Components

1. **Contract Metadata**
   - `token_name`: Name of the NFT collection
   - `token_symbol`: Symbol for the NFT
   - `token_uri`: Base URI for metadata

2. **State Management**
   - `total_supply`: Total number of NFTs minted
   - `next_token_id`: Next available token ID
   - `current_owner`: Current owner of the NFT
   - `current_token_id`: ID of the current NFT

3. **Access Control**
   - `minter`: Account authorized to mint NFTs

### Design Decisions

This is a **single NFT contract** implementation, meaning:
- Only one NFT can exist at a time
- Simplified state management
- Lower gas costs
- Easier to understand and audit

## API Reference

### Core Functions

#### `initialize(name, symbol, uri, minter)`
Initializes the contract with metadata and sets the minter.
- **Parameters:**
  - `name` (String): NFT collection name
  - `symbol` (String): NFT collection symbol
  - `uri` (String): Base URI for metadata
  - `minter` (Account): Address authorized to mint

#### `mint(to, metadata) -> token_id`
Mints a new NFT to the specified address.
- **Requirements:**
  - Caller must be the minter
  - Cannot mint to zero address
  - Only one NFT allowed per contract
- **Returns:** `token_id` (UInt64): ID of the minted NFT

#### `transfer(to, token_id)`
Transfers an NFT to another account.
- **Requirements:**
  - Caller must be the current owner
  - Cannot transfer to zero address
  - Token must exist

#### `burn(token_id)`
Destroys an NFT permanently.
- **Requirements:**
  - Caller must be the current owner
  - Token must exist

#### `transfer_from(from, to, token_id)`
Approved transfer between accounts.
- **Requirements:**
  - From account must be current owner
  - Caller must be owner or minter
  - Valid token ID

### View Functions

#### `balance_of(account) -> balance`
Returns the NFT balance for an account (0 or 1).

#### `owner_of(token_id) -> owner`
Returns the owner of a specific NFT.

#### `get_name() -> name`
Returns the NFT collection name.

#### `get_symbol() -> symbol`
Returns the NFT collection symbol.

#### `get_uri(token_id) -> uri`
Returns the metadata URI for a specific NFT.

#### `get_total_supply() -> supply`
Returns the total number of NFTs minted.

#### `exists(token_id) -> bool`
Checks if an NFT exists.

#### `set_minter(new_minter)`
Changes the minter account (minter only).

## Usage Examples

### 1. Deploy and Initialize

```python
from algopy import Account, String
from contract import SimpleNFT

# Create accounts
minter = Account()
owner = Account()

# Deploy contract
contract = SimpleNFT()

# Initialize contract
contract.initialize(
    name=String("My Awesome NFT"),
    symbol=String("MANFT"),
    uri=String("https://my-api.com/metadata/"),
    minter=minter
)
```

### 2. Mint an NFT

```python
# Mint NFT (only minter can do this)
token_id = contract.mint(
    to=owner,
    metadata=String("ipfs://QmHash...")
)
print(f"Minted NFT with ID: {token_id}")
```

### 3. Transfer NFT

```python
# Transfer to new owner
recipient = Account()
contract.transfer(
    to=recipient,
    token_id=UInt64(1)
)
```

### 4. Query Information

```python
# Check ownership
owner = contract.owner_of(UInt64(1))
balance = contract.balance_of(recipient)
exists = contract.exists(UInt64(1))

print(f"Owner: {owner}")
print(f"Balance: {balance}")
print(f"Exists: {exists}")
```

## Security Considerations

### ✅ Implemented Protections

1. **Access Control**
   - Only minter can mint NFTs
   - Only owner can transfer/burn their NFT
   - Protected minter role changes

2. **Input Validation**
   - Zero address protection
   - Token existence checks
   - Ownership verification

3. **State Consistency**
   - Atomic operations
   - Proper supply tracking
   - Ownership state management

### ⚠️ Important Notes

1. **Single NFT Limitation**
   - This contract supports only one NFT
   - Suitable for 1/1 collectibles
   - For multi-NFT collections, modify the implementation

2. **Metadata Management**
   - Metadata is not stored on-chain
   - URI should point to persistent storage
   - Consider IPFS for decentralized storage

3. **Gas Optimization**
   - Single NFT design reduces storage costs
   - Efficient state management
   - Minimal external calls

## Testing

The contract includes comprehensive tests covering:

- ✅ Contract initialization
- ✅ Minting functionality
- ✅ Transfer operations
- ✅ Burning operations
- ✅ Access control
- ✅ Error handling
- ✅ Edge cases

### Running Tests

```bash
# Install pytest if needed
pip install pytest

# Run test suite
python -m pytest test_contract.py -v
```

## Deployment

### Requirements

- Python 3.8+
- Algorand SDK
- PyTeal/ARC4
- Testnet/mainnet account with ALGOs

### Steps

1. **Setup Environment**
   ```bash
   pip install algopy
   ```

2. **Compile Contract**
   ```python
   # Contract will be compiled to TEAL bytecode
   # Deploy to Algorand network using SDK
   ```

3. **Deploy to Network**
   ```python
   # Create application transaction
   # Fund with minimum balance
   # Submit to network
   ```

## Frontend Integration

### Web3 Integration

The contract is designed to work with frontend applications:

```javascript
// Example frontend integration
const contract = new SimpleNFTContract(appId, algodClient);

// Initialize
await contract.initialize(name, symbol, uri, minter);

// Mint NFT
const tokenId = await contract.mint(recipient, metadata);

// Transfer
await contract.transfer(to, tokenId);

// Query
const owner = await contract.ownerOf(tokenId);
const balance = await contract.balanceOf(account);
```

### Metadata Structure

Recommended JSON metadata structure:

```json
{
  "name": "My NFT #1",
  "description": "A unique digital collectible",
  "image": "ipfs://QmHash...",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "external_url": "https://my-nft-site.com/nft/1"
}
```

## Future Enhancements

Potential improvements for production use:

1. **Multi-NFT Support**
   - Array-based ownership tracking
   - Batch operations
   - Enumerability functions

2. **Advanced Features**
   - Royalty payments
   - Approval mechanisms
   - Marketplace integration

3. **Optimizations**
   - Gas-efficient storage
   - Batch operations
   - Upgrade patterns

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues:
- Create GitHub issue
- Check documentation
- Review test cases for examples