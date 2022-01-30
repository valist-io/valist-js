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
        ERC1155("")
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

    string public symbol = "CONTRIB";
    string public name = "Proof of Contribution";

    /// Mints a Proof of Contribution NFT.
    ///
    /// @param teamName Name of the team.
    /// @param projectName Name of the project.
    /// @param releaseName Unique name used to identify the release.
    /// @param contributor Address of the recipient.
    function mint(
        string memory teamName,
        string memory projectName,
        string memory releaseName,
        address contributor
    ) public {
        uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(teamName)))));
        uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(projectName)))));
        uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(releaseName)))));
        require(
            valist.isTeamMember(teamID, _msgSender()) ||
            valist.isProjectMember(projectID, _msgSender()
        ), "err-proj-member");
        require(bytes(valist.metaByID(releaseID)).length > 0, "err-release-not-exist");
        _mint(contributor, releaseID, 1, "");
    }

    /// Mints a Proof of Contribution NFT to multiple contributors
    ///
    /// @param teamName Name of the team.
    /// @param projectName Name of the project.
    /// @param releaseName Unique name used to identify the release.
    /// @param contributors Addresses of the recipients.
    function mintBatch(
        string memory teamName,
        string memory projectName,
        string memory releaseName,
        address[] memory contributors
    ) public {
        uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(teamName)))));
        uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(projectName)))));
        uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(releaseName)))));
        require(
            valist.isTeamMember(teamID, _msgSender()) ||
            valist.isProjectMember(projectID, _msgSender()
        ), "err-proj-member");
        require(bytes(valist.metaByID(releaseID)).length > 0, "err-release-not-exist");

        for (uint i = 0; i < contributors.length; i++) {
            _mint(contributors[i], releaseID, 1, "");
        }
    }

    /// Fetches metaURI of the software the Proof of Contribution is linked to.
    ///
    /// @param id Unique releaseID generated from team, project, and version.
    function uri(uint256 id)
        public
        override(ERC1155, IERC1155MetadataURI)
        view
        returns (string memory)
    {
        string memory gateway = "https://gateway.valist.io";
        return string(abi.encodePacked(gateway, valist.metaByID(id)));
    }

}