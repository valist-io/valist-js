// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;

import "../IValist.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract SoftwareLicense is IERC1155MetadataURI, ERC1155, ERC2771Context {
    using EnumerableSet for EnumerableSet.UintSet;

    /// @dev internal reference to Valist registry contract
    IValist private valist;

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

    string public symbol = "LICENSE";
    string public name = "Software License";

    // @TODO ADD ROYALTIES

    /// @dev licenseID => mintPrice (in wei)
    mapping(uint256 => uint256) public priceByID;

    /// @dev licenseID => metaURI
    mapping(uint256 => string) public metaByID;

    /// @dev projectID => licenseIDs
    mapping(uint256 => EnumerableSet.UintSet) licensesByProjectID;

    /// @dev emitted when a license is created.
    event LicenseCreated(
        string _teamName,
        string _projectName,
        string _licenseName,
        uint256 _mintPrice,
        uint256 _licenseID
    );

    /// @dev emitted when a license is minted/purchased.
    event LicenseMinted(
        string _teamName,
        string _projectName,
        string _licenseName,
        address _recipient,
        uint256 _licenseID
    );

    /// Creates a new License and establishes the mint price.
    ///
    /// @param _teamName Name of the team.
    /// @param _projectName Name of the project.
    /// @param _licenseName Unique name used to identify the license.
    /// @param _metaURI metaURI of the license.
    /// @param _mintPrice mint price of the license in wei.
    function createLicense(
        string memory _teamName,
        string memory _projectName,
        string memory _licenseName,
        string memory _metaURI,
        uint256 _mintPrice
    )
        public
    {
        require(bytes(_metaURI).length > 0, "err-empty-meta");
        require(bytes(_teamName).length > 0, "err-empty-name");
        require(bytes(_projectName).length > 0, "err-empty-name");
        require(bytes(_licenseName).length > 0, "err-empty-name");

        uint256 teamID = valist.getTeamID(_teamName);
        uint256 projectID = valist.getProjectID(teamID, _projectName);
        uint licenseID = getLicenseID(projectID, _licenseName);

        require(valist.isTeamMember(teamID, _msgSender()), "err-team-member");
        require(bytes(valist.metaByID(projectID)).length > 0, "err-proj-not-exist");
        require(valist.getTeamBeneficiary(teamID) != address(0), "err-no-beneficiary");

        priceByID[licenseID] = _mintPrice;
        metaByID[licenseID] = _metaURI;
        licensesByProjectID[projectID].add(licenseID);

        emit LicenseCreated(_teamName, _projectName, _licenseName, _mintPrice, licenseID);
    }

    /// Mints a new license to a recipient.
    ///
    /// @param _teamName Name of the team.
    /// @param _projectName Name of the project.
    /// @param _licenseName Unique name used to identify the license.
    /// @param _recipient mint price of the license in wei.
    function mintLicense(
        string memory _teamName,
        string memory _projectName,
        string memory _licenseName,
        address _recipient
    )
        public
        payable
    {
        uint256 teamID = valist.getTeamID(_teamName);
        uint256 projectID = valist.getProjectID(teamID, _projectName);
        uint licenseID = getLicenseID(projectID, _licenseName);

        address beneficiary = valist.getTeamBeneficiary(teamID);

        require(beneficiary != address(0), "err-no-beneficiary");
        require(bytes(metaByID[licenseID]).length > 0, "err-license-not-exist");
        require(msg.value >= priceByID[licenseID], "err-mint-fee");

        (bool sent,) = beneficiary.call{value: msg.value}("");
        require(sent, "err-send-ether");

        _mint(_recipient, licenseID, 1, "");

        emit LicenseMinted(_teamName, _projectName, _licenseName, _recipient, licenseID);
    }

    /// Fetches metaURI of the Software License the software is linked to.
    ///
    /// @param id Unique licenseID generated from team, project, and licenseName.
    function uri(uint256 id)
        public
        override(ERC1155, IERC1155MetadataURI)
        view
        returns (string memory)
    {
        string memory gateway = "https://gateway.valist.io";
        return string(abi.encodePacked(gateway, metaByID[id]));
    }

    /// Generates a licenseID given a projectID and licenseName.
    /// Salts the ID with the token symbol to prevent collisions with releaseIDs.
    ///
    /// @param _projectID Unique ID of the project.
    /// @param _licenseName Unique name of the license.
    function getLicenseID(
        uint256 _projectID,
        string memory _licenseName
    )
        public
        view
        returns (uint256)
    {
        return uint(keccak256(abi.encodePacked(_projectID, symbol, keccak256(bytes(_licenseName)))));
    }
    
    /// Fetches licenseIDs within a project.
    ///
    /// @param _projectID Unique ID of the project.
    /// @param _page Page to return items from.
    /// @param _size Number of items to return.
    function getLicensesByProjectID(
        uint256 _projectID,
        uint256 _page,
        uint256 _size
    )
        public
        view
        returns (uint256[] memory)
    {
        uint start = _page * _size;
        uint limit = start + _size;

        if (limit > licensesByProjectID[_projectID].length()) {
            limit = licensesByProjectID[_projectID].length();
        }

        uint256[] memory values = new uint256[](limit - start);
        for (uint i = start; i < limit; ++i) {
            values[i - start] = licensesByProjectID[_projectID].at(i);
        }
        
        return values;
    }

}