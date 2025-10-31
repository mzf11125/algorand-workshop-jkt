"""
Simple test suite for the SimpleNFT contract.
"""

from algopy import Account, String, UInt64
from algopy_testing import algopy_testing_context
from contract import SimpleNFT


def test_basic_functionality():
    """Test basic NFT contract functionality"""
    with algopy_testing_context():
        # Create accounts
        minter = Account()
        owner = Account()

        # Create and initialize contract
        contract = SimpleNFT()
        contract.initialize(
            name=String("TestNFT"),
            symbol=String("TNFT"),
            uri=String("https://example.com/metadata.json"),
            minter=minter
        )

        # Test initial state
        assert contract.get_name() == String("TestNFT")
        assert contract.get_symbol() == String("TNFT")
        assert contract.get_total_supply() == UInt64(0)

        # Test minting with minter as sender
        contract.mint(
            to=owner,
            metadata=String("test metadata"),
            app_args=[],
            accounts=[minter, owner],
            foreign_assets=[],
            app_id=0
        )

        # Verify minted
        assert contract.get_total_supply() == UInt64(1)
        assert contract.balance_of(owner) == UInt64(1)
        assert contract.exists(UInt64(1)) == True
        assert contract.owner_of(UInt64(1)) == owner

        # Test transfer
        recipient = Account()
        contract.transfer(
            to=recipient,
            token_id=UInt64(1),
            app_args=[],
            accounts=[owner, recipient],
            foreign_assets=[],
            app_id=0
        )

        # Verify transfer
        assert contract.balance_of(owner) == UInt64(0)
        assert contract.balance_of(recipient) == UInt64(1)
        assert contract.owner_of(UInt64(1)) == recipient

        # Test burn
        contract.burn(
            token_id=UInt64(1),
            app_args=[],
            accounts=[recipient],
            foreign_assets=[],
            app_id=0
        )

        # Verify burned
        assert contract.get_total_supply() == UInt64(0)
        assert contract.balance_of(recipient) == UInt64(0)
        assert contract.exists(UInt64(1)) == False


if __name__ == "__main__":
    test_basic_functionality()
    print("All tests passed!")