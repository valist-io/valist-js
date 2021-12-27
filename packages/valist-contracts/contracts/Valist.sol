// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
// import "hardhat/console.sol";

contract Valist is ERC2771Context {
  constructor(address metaTxForwarder) ERC2771Context(metaTxForwarder) {}

  string public versionRecipient = "2.2.0";

  using EnumerableSet for EnumerableSet.AddressSet;

  // organization level role
  bytes32 constant ORG_ADMIN = keccak256("ORG_ADMIN_ROLE");
  // repository level role
  bytes32 constant REPO_DEV = keccak256("REPO_DEV_ROLE");
  // key operations
  bytes32 constant ADD_KEY = keccak256("ADD_KEY_OPERATION");
  bytes32 constant REVOKE_KEY = keccak256("REVOKE_KEY_OPERATION");
  bytes32 constant ROTATE_KEY = keccak256("ROTATE_KEY_OPERATION");

  struct Organization {
    // metadata CID
    string metaCID;
    // list of repo names
    string[] repoNames;
  }

  struct Repository {
    // check if repo exists
    bool exists;
    // metadata CID
    string metaCID;
    // list of release tags
    string[] tags;
  }

  struct Release {
    // release artifact
    string releaseCID;
    // release metadata
    string metaCID;
    // release signers
    address[] signers;
  }

  struct PendingRelease {
    // release tag (can be SemVer, CalVer, etc)
    string tag;
    // release artifact
    string releaseCID;
    // release metadata
    string metaCID;
  }

  struct PendingVote {
    // time of first proposal + 7 days
    uint expiration;
    // role signers
    EnumerableSet.AddressSet signers;
  }

  // incrementing orgNumber used for assigning unique IDs to organizations
  // this + chainID also prevents hash collision attacks on mapping selectors across orgs/repos
  uint public orgCount;

  // list of unique orgIDs
  // keccak256(abi.encodePacked(++orgCount, block.chainid))[]
  bytes32[] public orgIDs;

  // orgID => Organization
  mapping(bytes32 => Organization) public orgs;

  // keccak256(abi.encodePacked(orgID, repoName)) => Repository
  mapping(bytes32 => Repository) public repos;

  // keccak256(abi.encode(orgID, repoName, tag)) => Release
  // using abi.encode prevents hash collisions since there are multiple dynamic types here
  mapping(bytes32 => Release) public releases;

  // keccak256(abi.encodePacked(orgID, ORG_ADMIN)) => orgAdminSet
  // keccak256(abi.encodePacked(orgID, repoName, REPO_DEV)) => repoDevSet
  mapping(bytes32 => EnumerableSet.AddressSet) roles;

  // keccak256(abi.encodePacked(orgID, pendingOrgAdminAddress)) => orgAdminModifiedTimestamp
  // keccak256(abi.encodePacked(orgID, repoName, pendingRepoDevAddress)) => repoDevModifiedTimestamp
  // this is primarily used to auto-expire any pending operations on the same key once a vote is cast for said key
  mapping(bytes32 => uint) public roleModifiedTimestamps;

  // keccak256(abi.encodePacked(orgID, repoName)) => PendingRelease[]
  mapping(bytes32 => PendingRelease[]) public pendingReleaseRequests;

  // orgID => pendingOrgAdminSet
  // keccak256(abi.encodePacked(orgID, repoName)) => pendingRepoDevSet
  mapping(bytes32 => address[]) public pendingRoleRequests;

  // orgID => pendingOrgThreshold[]
  // keccak256(abi.encodePacked(orgID, repoName)) => pendingRepoThreshold[]
  mapping(bytes32 => uint[]) public pendingThresholdRequests;

  // pendingOrgAdminVotes: keccak256(abi.encodePacked(orgID, ORG_ADMIN, OPERATION, pendingOrgAdminAddress)) => signers
  // pendingOrgThresholdVotes: keccak256(abi.encodePacked(orgID, pendingOrgThreshold)) => signers
  // pendingRepoDevVotes: keccak256(abi.encodePacked(orgID, repoName, REPO_DEV, OPERATION, pendingRepoDevAddress)) => signers
  // pendingRepoThresholdVotes: keccak256(abi.encodePacked(orgID, repoName, pendingRepoThreshold)) => signers
  // pendingReleaseVotes: keccak256(abi.encode(orgID, repoName, tag, releaseCID, metaCID)) => PendingVote
  // using abi.encode prevents hash collisions since there are multiple dynamic types here
  mapping(bytes32 => PendingVote) pendingVotes;

  modifier orgAdmin(bytes32 _orgID) {
    require(isOrgAdmin(_orgID, _msgSender()), "Denied");
    _;
  }

  modifier repoDev(bytes32 _orgID, string memory _repoName) {
    require(isRepoDev(_orgID, _repoName, _msgSender()), "Denied");
    _;
  }

  event OrgCreated(bytes32 _orgID, string indexed _metaCIDHash, string _metaCID, address _admin);

  event RepoCreated(bytes32 _orgID, string indexed _repoNameHash, string _repoName, string indexed _metaCIDHash, string _metaCID);

  event MetaUpdate(bytes32 indexed _orgID, string indexed _repoName, address indexed _signer, string _metaCID);

  event VoteKeyEvent(bytes32 indexed _orgID, string _repoName, address _signer, bytes32 _operation, address _key);

  event VoteReleaseEvent(bytes32 _orgID, string _repoName, string _tag, string _releaseCID, string _metaCID, address _signer);

  // check if user has orgAdmin role
  function isOrgAdmin(bytes32 _orgID, address _address) public view returns (bool) {
    bytes32 selector = keccak256(abi.encodePacked(_orgID, ORG_ADMIN));
    return roles[selector].contains(_address);
  }

  // check if user has at least repoDev role
  function isRepoDev(bytes32 _orgID, string memory _repoName, address _address) public view returns (bool) {
    if (bytes(_repoName).length > 0) {
      require(repos[keccak256(abi.encodePacked(_orgID, _repoName))].exists, "No repo");
      bytes32 selector = keccak256(abi.encodePacked(_orgID, _repoName, REPO_DEV));
      return roles[selector].contains(_address) || isOrgAdmin(_orgID, _address);
    } else {
      return isOrgAdmin(_orgID, _address);
    }
  }

  // create an organization and claim an orgID
  function createOrganization(string memory _orgMeta) public {
    require(bytes(_orgMeta).length > 0, "No orgMeta");
    // generate new orgID by incrementing and hashing orgCount
    bytes32 orgID = keccak256(abi.encodePacked(++orgCount, block.chainid));
    // set Organization ID and metadata
    orgs[orgID].metaCID = _orgMeta;
    // add to list of orgIDs
    orgIDs.push(orgID);
    // add creator of org to orgAdmin role
    roles[keccak256(abi.encodePacked(orgID, ORG_ADMIN))].add(_msgSender());
    // log new orgID
    emit OrgCreated(orgID, _orgMeta, _orgMeta, _msgSender());
    // log new key to help filter client side orgIDs that a key is associated with
    emit VoteKeyEvent(orgID, "", _msgSender(), ADD_KEY, _msgSender());
  }

  function createRepository(bytes32 _orgID, string memory _repoName, string memory _repoMeta) public orgAdmin(_orgID) {
    bytes32 repoSelector = keccak256(abi.encodePacked(_orgID, _repoName));
    require(!repos[repoSelector].exists, "Repo exists");
    require(bytes(_repoName).length > 0, "No repoName");
    require(bytes(_repoMeta).length > 0, "No repoMeta");
    // add repoName to org
    orgs[_orgID].repoNames.push(_repoName);
    // set repo exists
    repos[repoSelector].exists = true;
    // set metadata for repo
    repos[repoSelector].metaCID = _repoMeta;
    // log new repo
    emit RepoCreated(_orgID, _repoName, _repoName, _repoMeta, _repoMeta);
  }

  function voteRelease(
    bytes32 _orgID,
    string memory _repoName,
    string memory _tag,
    string memory _releaseCID,
    string memory _metaCID
  ) public repoDev(_orgID, _repoName) {
    require(bytes(_tag).length > 0, "No tag");
    require(bytes(_releaseCID).length > 0, "No releaseCID");
    require(bytes(_metaCID).length > 0, "No metaCID");
    bytes32 releaseSelector = keccak256(abi.encode(_orgID, _repoName, _tag));
    require(bytes(releases[releaseSelector].releaseCID).length == 0, "Tag used");
    bytes32 repoSelector = keccak256(abi.encodePacked(_orgID, _repoName));

    releases[releaseSelector].releaseCID = _releaseCID;
    releases[releaseSelector].metaCID = _metaCID;
    // add user to release signers
    releases[releaseSelector].signers.push(_msgSender());
    // push tag to repo
    repos[repoSelector].tags.push(_tag);
    // fire ReleaseEvent to notify live clients
    emit VoteReleaseEvent(_orgID, _repoName, _tag, _releaseCID, _metaCID, _msgSender());
  }

  function setOrgMeta(bytes32 _orgID, string memory _metaCID) public orgAdmin(_orgID) {
    orgs[_orgID].metaCID = _metaCID;
    emit MetaUpdate(_orgID, "", _msgSender(), _metaCID);
  }

  function setRepoMeta(bytes32 _orgID, string memory _repoName, string memory _metaCID) public orgAdmin(_orgID) {
    repos[keccak256(abi.encodePacked(_orgID, _repoName))].metaCID = _metaCID;
    emit MetaUpdate(_orgID, _repoName, _msgSender(), _metaCID);
  }

  function voteKey(bytes32 _orgID, string memory _repoName, bytes32 _operation, address _key) public repoDev(_orgID, _repoName) {
    require(_operation == ADD_KEY || _operation == REVOKE_KEY || _operation == ROTATE_KEY, "Invalid op");
    bool isRepoOperation = bytes(_repoName).length > 0;
    bytes32 voteSelector;
    bytes32 roleSelector;
    bytes32 repoSelector;
    if (isRepoOperation) {
      voteSelector = keccak256(abi.encodePacked(_orgID, _repoName, REPO_DEV, _operation, _key));
      roleSelector = keccak256(abi.encodePacked(_orgID, _repoName, REPO_DEV));
      repoSelector = keccak256(abi.encodePacked(_orgID, _repoName));
    } else {
      voteSelector = keccak256(abi.encodePacked(_orgID, ORG_ADMIN, _operation, _key));
      roleSelector = keccak256(abi.encodePacked(_orgID, ORG_ADMIN));
    }
    // when revoking key, ensure key is in role
    if (_operation == REVOKE_KEY) {
      require(roles[roleSelector].contains(_key), "No Key");
      roles[roleSelector].remove(_key);
    } else {
      // otherwise, if adding or rotating, ensure key is not in role
      require(!roles[roleSelector].contains(_key), "Key exists");
    }
    // allow self-serve key rotation
    if (_operation == ROTATE_KEY) {
      // double check role -- if _msgSender() is an orgAdmin, just relying on the repoDev modifier would allow
      // this function to bypass the threshold and would add the new key and keep the old key
      require(roles[roleSelector].contains(_msgSender()), "Denied");
      roles[roleSelector].remove(_msgSender());
      roles[roleSelector].add(_key);
    }
    if (_operation == ADD_KEY) {
      roles[roleSelector].add(_key);
      emit VoteKeyEvent(_orgID, _repoName, _msgSender(), _operation, _key);
    }
  }

  function getLatestRelease(bytes32 _orgID, string memory _repoName) public view returns (string memory, string memory, string memory, address[] memory) {
    Repository storage repo = repos[keccak256(abi.encodePacked(_orgID, _repoName))];
    Release storage release = releases[keccak256(abi.encode(_orgID, _repoName, repo.tags[repo.tags.length - 1]))];
    return (repo.tags[repo.tags.length - 1], release.releaseCID, release.metaCID, release.signers);
  }

  // get paginated list of repo names
  function getRepoNames(bytes32 _orgID, uint _page, uint _resultsPerPage) public view returns (string[] memory) {
    uint i = _resultsPerPage * _page - _resultsPerPage;
    uint limit = _page * _resultsPerPage;
    if (limit > orgs[_orgID].repoNames.length) {
      limit = orgs[_orgID].repoNames.length;
    }
    string[] memory _repoNames = new string[](_resultsPerPage);
    for (i; i < limit; ++i) {
      _repoNames[i] = orgs[_orgID].repoNames[i];
    }
    return _repoNames;
  }

  // get paginated list of release tags from repo
  function getReleaseTags(bytes32 _selector, uint _page, uint _resultsPerPage) public view returns (string[] memory) {
    uint i = _resultsPerPage * _page - _resultsPerPage;
    uint limit = _page * _resultsPerPage;
    if (limit > repos[_selector].tags.length) {
      limit = repos[_selector].tags.length;
    }
    string[] memory _tags = new string[](_resultsPerPage);
    for (i; i < limit; ++i) {
      _tags[i] = repos[_selector].tags[i];
    }
    return _tags;
  }

  function getRoleMembers(bytes32 _selector) public view returns (address[] memory) {
    address[] memory members = new address[](roles[_selector].length());
    for (uint i = 0; i < roles[_selector].length(); ++i) {
      members[i] = roles[_selector].at(i);
    }
    return members;
  }
}
