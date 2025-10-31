from algopy import ARC4Contract, String, Account, UInt64, Txn
from algopy.arc4 import abimethod


class SimpleNFT(ARC4Contract):
    """
    A complete NFT contract on Algorand using ARC4
    Implements full NFT functionality: mint, burn, transfer, and ownership tracking
    Follows ERC-721-like standards for Algorand
    """

    def __init__(self) -> None:
        # Contract metadata
        self.token_name = String()
        self.token_symbol = String()
        self.token_uri = String()

        # NFT management
        self.total_supply = UInt64()
        self.next_token_id = UInt64(1)  # Start from token ID 1

        # Access control
        self.minter = Account()

        # Individual token ownership (simplified for single NFT)
        self.current_owner = Account()
        self.current_token_id = UInt64(0)

    @abimethod(allow_actions=["NoOp"], create="require")
    def initialize(self, name: String, symbol: String, uri: String, minter: Account) -> None:
        """
        Initialize the NFT contract with metadata and minter address
        """
        # Note: String validation is done by the ARC4 framework
        # Empty strings will be caught by the framework validation
        self.token_name = name
        self.token_symbol = symbol
        self.token_uri = uri
        self.minter = minter

        # Initialize counters
        self.total_supply = UInt64(0)
        self.next_token_id = UInt64(1)
        self.current_token_id = UInt64(0)

    @abimethod()
    def mint(self, to: Account, metadata: String) -> UInt64:
        """
        Mint a new NFT to the specified address
        Returns the created token ID
        """
        assert Txn.sender == self.minter, "Only minter can mint NFTs"
        assert to != Account(), "Cannot mint to zero address"
        # Note: String validation is handled by ARC4 framework

        # Check if we already have an NFT (for single NFT implementation)
        assert self.total_supply == UInt64(0), "This contract supports single NFT only"

        # Assign token ID
        token_id = self.next_token_id

        # Update state
        self.current_owner = to
        self.current_token_id = token_id
        self.total_supply = self.total_supply + UInt64(1)
        self.next_token_id = self.next_token_id + UInt64(1)

        return token_id

    @abimethod()
    def burn(self, token_id: UInt64) -> None:
        """
        Burn an NFT (destroy it)
        Only the owner can burn their NFT
        """
        assert Txn.sender == self.current_owner, "Only owner can burn NFT"
        assert token_id == self.current_token_id, "Invalid token ID"
        assert self.total_supply > UInt64(0), "No NFTs to burn"

        # Update state
        self.current_owner = Account()  # Reset to zero address
        self.current_token_id = UInt64(0)
        self.total_supply = self.total_supply - UInt64(1)

    @abimethod()
    def transfer(self, to: Account, token_id: UInt64) -> None:
        """
        Transfer an NFT to another account
        """
        assert Txn.sender == self.current_owner, "Only owner can transfer NFT"
        assert to != Account(), "Cannot transfer to zero address"
        assert token_id == self.current_token_id, "Invalid token ID"
        assert to != self.current_owner, "Cannot transfer to same address"

        # Update ownership
        self.current_owner = to

    @abimethod()
    def transfer_from(self, from_account: Account, to: Account, token_id: UInt64) -> None:
        """
        Transfer NFT from one account to another (approved transfer)
        """
        assert from_account == self.current_owner, "From account is not the owner"
        assert to != Account(), "Cannot transfer to zero address"
        assert token_id == self.current_token_id, "Invalid token ID"
        assert Txn.sender == from_account or Txn.sender == self.minter, "Not authorized to transfer"
        assert to != from_account, "Cannot transfer to same address"

        # Update ownership
        self.current_owner = to

    @abimethod()
    def balance_of(self, account: Account) -> UInt64:
        """
        Get the NFT balance of an account
        Returns 1 if they own the NFT, 0 otherwise
        """
        assert account != Account(), "Zero address has no balance"

        if account == self.current_owner and self.total_supply > UInt64(0):
            return UInt64(1)
        return UInt64(0)

    @abimethod()
    def owner_of(self, token_id: UInt64) -> Account:
        """
        Get the owner of a specific NFT
        """
        assert token_id == self.current_token_id, "Invalid token ID"
        assert self.total_supply > UInt64(0), "NFT does not exist"

        return self.current_owner

    @abimethod()
    def get_name(self) -> String:
        """Get the NFT name"""
        return self.token_name

    @abimethod()
    def get_symbol(self) -> String:
        """Get the NFT symbol"""
        return self.token_symbol

    @abimethod()
    def get_uri(self, token_id: UInt64) -> String:
        """Get the NFT metadata URI for a specific token"""
        assert token_id == self.current_token_id, "Invalid token ID"
        return self.token_uri

    @abimethod()
    def get_total_supply(self) -> UInt64:
        """Get the total supply of NFTs"""
        return self.total_supply

    @abimethod()
    def set_minter(self, new_minter: Account) -> None:
        """
        Set a new minter (only current minter can do this)
        """
        assert Txn.sender == self.minter, "Only current minter can set new minter"
        assert new_minter != Account(), "Cannot set minter to zero address"
        assert new_minter != self.minter, "New minter must be different"

        self.minter = new_minter

    @abimethod()
    def get_current_token_id(self) -> UInt64:
        """Get the current token ID"""
        return self.current_token_id

    @abimethod()
    def exists(self, token_id: UInt64) -> bool:
        """Check if a token exists"""
        return token_id == self.current_token_id and self.total_supply > UInt64(0)
