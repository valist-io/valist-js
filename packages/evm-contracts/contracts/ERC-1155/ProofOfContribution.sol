// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;

import "../IValist.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

contract ProofOfContribution is IERC1155MetadataURI, ERC1155, ERC2771Context {

    /// @dev internal reference to Valist registry contract
    IValist private valist;

    using EnumerableSet for EnumerableSet.AddressSet;
    /// @dev version of BaseRelayRecipient this contract implements
    string public versionRecipient = "2.2.0";

    /// Creates a Proof of Contribution NFT Contract.
    ///
    /// @param _valistRegistry Address for Valist registry contract.
    /// @param _trustedForwarder Address for meta transactions.
    constructor(
        address _valistRegistry,
        address _trustedForwarder
    )
        ERC1155("https://valist.io/api/{id}")
        ERC2771Context(_trustedForwarder)
    {
        valist = IValist(_valistRegistry);
    }

    function _msgSender() internal view virtual override(Context, ERC2771Context) returns (address sender) {
        if (isTrustedForwarder(msg.sender)) {
            // The assembly code is more direct than the Solidity version using `abi.decode`.
            assembly {
                sender := shr(96, calldataload(sub(calldatasize(), 20)))
            }
        } else {
            return super._msgSender();
        }
    }

    function _msgData() internal view virtual override(Context, ERC2771Context) returns (bytes calldata) {
        if (isTrustedForwarder(msg.sender)) {
            return msg.data[:msg.data.length - 20];
        } else {
            return super._msgData();
        }
    }

    /// BEGIN TOKEN CONTRACT

    uint256 public constant PROOF = 0;

    function balanceOf(address account, uint256 id) public view override(ERC1155, IERC1155) returns (uint256) {

    }

    function balanceOfBatch(
        address[] memory accounts,
        uint256[] memory id
    )
        public
        view
        override(ERC1155, IERC1155)
        returns (uint256[] memory)
    {

    }

    function setApprovalForAll(address operator, bool approved) public override(ERC1155, IERC1155) {

    }

    function isApprovedForAll(
        address account,
        address operator
    )
        public
        view
        override(ERC1155, IERC1155)
        returns (bool)
    {

    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) 
        public
        override(ERC1155, IERC1155)
    {

    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) 
        public
        override(ERC1155, IERC1155)
    {

    }

    function uri(uint256)
        public
        override(ERC1155, IERC1155MetadataURI)
        view
        returns (string memory)
    {

    }

}