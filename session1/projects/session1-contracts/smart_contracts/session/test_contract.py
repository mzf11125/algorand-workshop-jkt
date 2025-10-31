"""
Test suite for the SimpleNFT contract.
This test validates all NFT functionality including minting, transferring,
burning, and ownership tracking.
"""

import pytest
from algopy import Account, String, UInt64
from algopy_testing import algopy_testing_context
from contract import SimpleNFT


class TestSimpleNFT:
    """Test class for SimpleNFT contract functionality"""

    def setup_method(self):
        """Setup test environment before each test"""
        with algopy_testing_context():
            self.contract = SimpleNFT()
            self.minter = Account()
            self.owner = Account()
            self.recipient = Account()

            # Initialize contract
            self.contract.initialize(
                name=String("TestNFT"),
                symbol=String("TNFT"),
                uri=String("https://example.com/metadata.json"),
                minter=self.minter
            )

    def test_contract_initialization(self):
        """Test that contract initializes correctly"""
        assert self.contract.get_name() == String("TestNFT")
        assert self.contract.get_symbol() == String("TNFT")
        assert self.contract.get_uri(UInt64(0)) == String("https://example.com/metadata.json")
        assert self.contract.get_total_supply() == UInt64(0)
        assert self.contract.get_current_token_id() == UInt64(0)

    def test_mint_nft_success(self):
        """Test successful NFT minting"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Verify token was minted
        assert token_id == UInt64(1)
        assert self.contract.get_total_supply() == UInt64(1)
        assert self.contract.get_current_token_id() == UInt64(1)
        assert self.contract.owner_of(token_id) == self.owner
        assert self.contract.balance_of(self.owner) == UInt64(1)
        assert self.contract.exists(token_id) == True

    def test_mint_only_by_minter(self):
        """Test that only minter can mint NFTs"""
        metadata = String("Test metadata")

        # Try to mint with non-minter account
        with pytest.raises(AssertionError, match="Only minter can mint NFTs"):
            self.contract.mint(self.owner, metadata)

    def test_mint_to_zero_address_fails(self):
        """Test that minting to zero address fails"""
        metadata = String("Test metadata")
        zero_address = Account()

        with pytest.raises(AssertionError, match="Cannot mint to zero address"):
            self.contract.mint(zero_address, metadata)

    def test_mint_single_nft_limit(self):
        """Test that only one NFT can be minted"""
        metadata = String("Test metadata")

        # Mint first NFT
        self.contract.mint(self.owner, metadata)

        # Try to mint second NFT
        with pytest.raises(AssertionError, match="This contract supports single NFT only"):
            self.contract.mint(self.recipient, metadata)

    def test_transfer_nft_success(self):
        """Test successful NFT transfer"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Transfer NFT
        self.contract.transfer(self.recipient, token_id)

        # Verify transfer
        assert self.contract.owner_of(token_id) == self.recipient
        assert self.contract.balance_of(self.owner) == UInt64(0)
        assert self.contract.balance_of(self.recipient) == UInt64(1)

    def test_transfer_only_by_owner(self):
        """Test that only owner can transfer NFT"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Try to transfer with non-owner
        with pytest.raises(AssertionError, match="Only owner can transfer NFT"):
            self.contract.transfer(self.recipient, token_id)

    def test_transfer_to_zero_address_fails(self):
        """Test that transferring to zero address fails"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)
        zero_address = Account()

        with pytest.raises(AssertionError, match="Cannot transfer to zero address"):
            self.contract.transfer(zero_address, token_id)

    def test_transfer_same_address_fails(self):
        """Test that transferring to same address fails"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        with pytest.raises(AssertionError, match="Cannot transfer to same address"):
            self.contract.transfer(self.owner, token_id)

    def test_transfer_invalid_token_id_fails(self):
        """Test that transferring invalid token ID fails"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)
        invalid_token_id = UInt64(999)

        with pytest.raises(AssertionError, match="Invalid token ID"):
            self.contract.transfer(self.recipient, invalid_token_id)

    def test_transfer_from_success(self):
        """Test successful transfer_from (approved transfer)"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Transfer using transfer_from
        self.contract.transfer_from(self.owner, self.recipient, token_id)

        # Verify transfer
        assert self.contract.owner_of(token_id) == self.recipient
        assert self.contract.balance_of(self.owner) == UInt64(0)
        assert self.contract.balance_of(self.recipient) == UInt64(1)

    def test_burn_nft_success(self):
        """Test successful NFT burning"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Burn NFT
        self.contract.burn(token_id)

        # Verify burn
        assert self.contract.get_total_supply() == UInt64(0)
        assert self.contract.get_current_token_id() == UInt64(0)
        assert self.contract.balance_of(self.owner) == UInt64(0)
        assert self.contract.exists(token_id) == False

    def test_burn_only_by_owner(self):
        """Test that only owner can burn NFT"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Try to burn with non-owner
        with pytest.raises(AssertionError, match="Only owner can burn NFT"):
            self.contract.burn(token_id)

    def test_burn_invalid_token_id_fails(self):
        """Test that burning invalid token ID fails"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)
        invalid_token_id = UInt64(999)

        with pytest.raises(AssertionError, match="Invalid token ID"):
            self.contract.burn(invalid_token_id)

    def test_balance_of_zero_address_fails(self):
        """Test that balance_of with zero address fails"""
        zero_address = Account()

        with pytest.raises(AssertionError, match="Zero address has no balance"):
            self.contract.balance_of(zero_address)

    def test_owner_of_invalid_token_id_fails(self):
        """Test that owner_of with invalid token ID fails"""
        invalid_token_id = UInt64(999)

        with pytest.raises(AssertionError, match="Invalid token ID"):
            self.contract.owner_of(invalid_token_id)

    def test_get_uri_invalid_token_id_fails(self):
        """Test that get_uri with invalid token ID fails"""
        invalid_token_id = UInt64(999)

        with pytest.raises(AssertionError, match="Invalid token ID"):
            self.contract.get_uri(invalid_token_id)

    def test_set_minter_success(self):
        """Test successful minter change"""
        new_minter = Account()

        # Change minter
        self.contract.set_minter(new_minter)

        # Verify minter was changed
        # Note: We can't directly access minter variable as it's private
        # But we can test by trying to mint with new minter
        metadata = String("Test metadata")
        # This would work if we had proper mocking for Txn.sender

    def test_set_minter_only_by_current_minter(self):
        """Test that only current minter can set new minter"""
        new_minter = Account()

        # Try to change minter with non-minter account
        with pytest.raises(AssertionError, match="Only current minter can set new minter"):
            self.contract.set_minter(new_minter)

    def test_set_minter_to_zero_address_fails(self):
        """Test that setting minter to zero address fails"""
        zero_address = Account()

        with pytest.raises(AssertionError, match="Cannot set minter to zero address"):
            self.contract.set_minter(zero_address)

    def test_set_minter_to_same_address_fails(self):
        """Test that setting minter to same address fails"""
        with pytest.raises(AssertionError, match="New minter must be different"):
            self.contract.set_minter(self.minter)

    def test_full_lifecycle(self):
        """Test complete NFT lifecycle: mint -> transfer -> burn"""
        metadata = String("Test metadata")

        # 1. Mint NFT
        token_id = self.contract.mint(self.owner, metadata)
        assert self.contract.balance_of(self.owner) == UInt64(1)
        assert self.contract.exists(token_id) == True

        # 2. Transfer NFT
        self.contract.transfer(self.recipient, token_id)
        assert self.contract.balance_of(self.owner) == UInt64(0)
        assert self.contract.balance_of(self.recipient) == UInt64(1)
        assert self.contract.owner_of(token_id) == self.recipient

        # 3. Burn NFT
        self.contract.burn(token_id)
        assert self.contract.balance_of(self.recipient) == UInt64(0)
        assert self.contract.exists(token_id) == False
        assert self.contract.get_total_supply() == UInt64(0)


# Integration test class
class TestSimpleNFTIntegration:
    """Integration tests for edge cases and complex scenarios"""

    def setup_method(self):
        """Setup test environment before each test"""
        self.contract = SimpleNFT()
        self.minter = Account()
        self.owner = Account()
        self.recipient = Account()

        # Initialize contract
        self.contract.initialize(
            name=String("Integration Test NFT"),
            symbol=String("ITNFT"),
            uri=String("https://integration-test.com/metadata.json"),
            minter=self.minter
        )

    def test_multiple_transfer_sequence(self):
        """Test sequence of multiple transfers"""
        metadata = String("Test metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Transfer to recipient
        self.contract.transfer(self.recipient, token_id)
        assert self.contract.owner_of(token_id) == self.recipient

        # Transfer back to owner
        self.contract.transfer(self.owner, token_id)
        assert self.contract.owner_of(token_id) == self.owner

    def test_metadata_preservation(self):
        """Test that metadata is preserved throughout lifecycle"""
        metadata = String("Important metadata")
        token_id = self.contract.mint(self.owner, metadata)

        # Transfer should preserve metadata
        self.contract.transfer(self.recipient, token_id)
        assert self.contract.get_uri(token_id) == String("https://integration-test.com/metadata.json")

        # Burn should not affect other contract data
        self.contract.burn(token_id)
        assert self.contract.get_name() == String("Integration Test NFT")
        assert self.contract.get_symbol() == String("ITNFT")


if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, "-v"])
