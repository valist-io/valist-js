// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;

import "./IValist.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title Valist registry contract
///
/// @custom:err-empty-meta metadata URI is required
/// @custom:err-empty-members atleast one member is required
/// @custom:err-empty-name name is required
/// @custom:err-name-claimed name has already been claimed
/// @custom:err-team-member sender is not a team member
/// @custom:err-proj-member sender is not a project member
/// @custom:err-member-exist member already exists
/// @custom:err-member-not-exist member does not exist
/// @custom:err-release-not-exist release does not exist
/// @custom:err-team-not-exist team does not exist
/// @custom:err-proj-not-exist project does not exist
contract Valist is IValist, ERC2771Context {
  using EnumerableSet for EnumerableSet.AddressSet;

  struct Team {
    string[] projectNames;
    EnumerableSet.AddressSet members;
  }

  struct Project {
    string[] releaseNames;
    EnumerableSet.AddressSet members;
  }

  struct Release {
    EnumerableSet.AddressSet approvers;
    EnumerableSet.AddressSet rejectors;
  }

  /// @dev list of all team names
  string[] private teamNames;

  /// @dev teamID = keccak256(abi.encodePacked(block.chainId, keccak256(bytes(teamName))))
  mapping(uint256 => Team) private teamByID;
  /// @dev projectID = keccak256(abi.encodePacked(teamID, keccak256(bytes(projectName))))
  mapping(uint256 => Project) private projectByID;
  /// @dev releaseID = keccak256(abi.encodePacked(projectID, keccak256(bytes(releaseName))))
  mapping(uint256 => Release) private releaseByID;
  /// @dev mapping of team, project, and release IDs to metadata URIs
  mapping(uint256 => string) public override metaByID;

  /// @dev version of BaseRelayRecipient this contract implements
  string public versionRecipient = "2.2.0";

  /// Creates a Valist registry.
  ///
  /// @param _trustedForwarder Address for meta transactions.
  constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {}

  // @TODO
  // cascade admin keys to be able to publish
  // add modifiers for roles
  // add id generator functions

  // modifier teamMembers(string memory _teamName, address _member) {
  //   uint teamID = getTeamID(_teamName);
  //   require(teamByID[teamID].members.contains(_member), "err-team-member");
  //   _;
  // }

  // modifier projectMembers(string memory _teamName, string memory _projectName, address _member) {
  //   uint teamID = getTeamID(_teamName);
  //   require(teamByID[teamID].members.contains(_member), "err-team-member");
  //   _;
  // }

  /// Creates a new team with the given members.
  ///
  /// @param _teamName Unique name used to identify the team.
  /// @param _metaURI URI of the team metadata.
  /// @param _members List of members to add to the team.
  function createTeam(
    string memory _teamName, 
    string memory _metaURI, 
    address[] memory _members
  ) 
    public
    override
  {
    require(bytes(_metaURI).length > 0, "err-empty-meta");
    require(bytes(_teamName).length > 0, "err-empty-name");
    require(_members.length > 0, "err-empty-members");

    uint256 teamID = getTeamID(_teamName);

    require(bytes(metaByID[teamID]).length == 0, "err-name-claimed");

    metaByID[teamID] = _metaURI;
    teamNames.push(_teamName);

    for (uint i = 0; i < _members.length; i++) {
      teamByID[teamID].members.add(_members[i]);
    }

    emit TeamCreated(_teamName, _metaURI, _msgSender());
  }
  
  /// Creates a new project. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team to create the project under.
  /// @param _projectName Unique name used to identify the project.
  /// @param _metaURI URI of the project metadata.
  /// @param _members Optional list of members to add to the project.
  function createProject(
    string memory _teamName, 
    string memory _projectName,
    string memory _metaURI,
    address[] memory _members
  )
    public
    override
  {
    require(bytes(_metaURI).length > 0, "err-empty-meta");
    require(bytes(_projectName).length > 0, "err-empty-name");

    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);

    require(isTeamMember(teamID, _msgSender()), "err-team-member");
    require(bytes(metaByID[projectID]).length == 0, "err-name-claimed");

    metaByID[projectID] = _metaURI;
    teamByID[teamID].projectNames.push(_projectName);

    for (uint i = 0; i < _members.length; i++) {
      projectByID[projectID].members.add(_members[i]);
    }

    emit ProjectCreated(_teamName, _projectName, _metaURI, _msgSender());
  }

  /// Creates a new release. Requires the sender to be a member of the project.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Unique name used to identify the release.
  /// @param _metaURI URI of the project metadata.
  function createRelease(
    string memory _teamName, 
    string memory _projectName,
    string memory _releaseName,
    string memory _metaURI
  )
    public
    override
  {
    require(bytes(_metaURI).length > 0, "err-empty-meta");
    require(bytes(_projectName).length > 0, "err-empty-name");
    require(bytes(_releaseName).length > 0, "err-empty-name");

    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    uint256 releaseID = getReleaseID(projectID, _releaseName);

    require(
      isTeamMember(teamID, _msgSender()) ||
      isProjectMember(projectID, _msgSender()),
      "err-proj-member"
    );

    require(bytes(metaByID[releaseID]).length == 0, "err-name-claimed");

    metaByID[releaseID] = _metaURI;
    projectByID[projectID].releaseNames.push(_releaseName);
    emit ReleaseCreated(_teamName, _projectName, _releaseName, _metaURI, _msgSender());
  }

  /// Approve the release by adding the sender's address to the approvers list.
  /// The sender's address will be removed from the rejectors list if it exists.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  function approveRelease(
    string memory _teamName, 
    string memory _projectName,
    string memory _releaseName
  )
    public
    override
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    uint256 releaseID = getReleaseID(projectID, _releaseName);

    require(bytes(metaByID[releaseID]).length > 0, "err-release-not-exist");

    releaseByID[releaseID].approvers.add(_msgSender());
    releaseByID[releaseID].rejectors.remove(_msgSender());
    emit ReleaseApproved(_teamName, _projectName, _releaseName, _msgSender());
  }

  /// Reject the release by adding the sender's address to the rejectors list.
  /// The sender's address will be removed from the approvers list if it exists.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  function rejectRelease(
    string memory _teamName, 
    string memory _projectName,
    string memory _releaseName
  ) 
    public
    override 
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    uint256 releaseID = getReleaseID(projectID, _releaseName);

    require(bytes(metaByID[releaseID]).length > 0, "err-release-not-exist");

    releaseByID[releaseID].rejectors.add(_msgSender());
    releaseByID[releaseID].approvers.remove(_msgSender());
    emit ReleaseRejected(_teamName, _projectName, _releaseName, _msgSender());
  }

  /// Add a member to the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function addTeamMember(string memory _teamName, address _address) public override {
    uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));
    
    require(teamByID[teamID].members.contains(_msgSender()) == true, "err-team-member");
    require(teamByID[teamID].members.contains(_address) == false, "err-member-exist");

    teamByID[teamID].members.add(_address);
    emit TeamMemberAdded(_teamName, _address);
  }

  /// Remove a member from the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function removeTeamMember(string memory _teamName, address _address) public override {
    uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));

    require(teamByID[teamID].members.contains(_msgSender()) == true, "err-team-member");
    require(teamByID[teamID].members.contains(_address) == true, "err-member-not-exist");

    teamByID[teamID].members.remove(_address);
    emit TeamMemberRemoved(_teamName, _address);
  }

  /// Add a member to the project. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _address Address of member.
  function addProjectMember(
    string memory _teamName, 
    string memory _projectName, 
    address _address
  )
    public
    override
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    
    require(bytes(metaByID[projectID]).length > 0, "err-proj-not-exist");
    require(teamByID[teamID].members.contains(_msgSender()) == true, "err-team-member");
    require(projectByID[projectID].members.contains(_address) == false, "err-member-exist");

    projectByID[projectID].members.add(_address);
    emit ProjectMemberAdded(_teamName, _projectName, _address);
  }

  /// Remove a member from the project. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _address Address of member.
  function removeProjectMember(
    string memory _teamName, 
    string memory _projectName, 
    address _address
  )
    public
    override
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    
    require(bytes(metaByID[projectID]).length > 0, "err-proj-not-exist");
    require(teamByID[teamID].members.contains(_msgSender()) == true, "err-team-member");
    require(projectByID[projectID].members.contains(_address) == true, "err-member-not-exist"); 

    projectByID[projectID].members.remove(_address);
    emit ProjectMemberRemoved(_teamName, _projectName, _address);   
  }

  /// Sets the team metadata URI. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _metaURI Metadata URI.
  function setTeamMetaURI(
    string memory _teamName,
    string memory _metaURI
  )
    public
    override
  {
    require(bytes(_metaURI).length > 0, "err-empty-meta");

    uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));

    require(teamByID[teamID].members.contains(_msgSender()), "err-team-member");
    require(bytes(metaByID[teamID]).length > 0, "err-team-not-exist");

    metaByID[teamID] = _metaURI;
    emit TeamUpdated(_teamName, _metaURI, _msgSender());
  }

  /// Sets the project metadata URI. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _metaURI Metadata URI.
  function setProjectMetaURI(
    string memory _teamName,
    string memory _projectName,
    string memory _metaURI
  )
    public
    override
  {
    require(bytes(_metaURI).length > 0, "err-empty-meta");

    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);

    require(teamByID[teamID].members.contains(_msgSender()), "err-team-member");
    require(bytes(metaByID[projectID]).length > 0, "err-proj-not-exist");

    metaByID[projectID] = _metaURI;
    emit ProjectUpdated(_teamName, _projectName, _metaURI, _msgSender());
  }

  /// Generates teamID from teamName.
  ///
  /// @param _teamName Name of the team.
  function getTeamID(
    string memory _teamName
  )
    public
    view
    override
    returns (uint)
  {
    return uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));
  }

  /// Generates projectID from teamID and projectName.
  ///
  /// @param _teamID Unique team ID.
  /// @param _projectName Name of the project.
  function getProjectID(
    uint _teamID,
    string memory _projectName
  )
    public
    pure
    override
    returns (uint)
  {
    return uint(keccak256(abi.encodePacked(_teamID, keccak256(bytes(_projectName)))));
  }

  /// Generates releaseID from projectID and releaseName.
  ///
  /// @param _projectID Unique project ID.
  /// @param _releaseName Name of the release.
  function getReleaseID(
    uint _projectID,
    string memory _releaseName
  )
    public
    pure
    override
    returns (uint)
  {
    return uint(keccak256(abi.encodePacked(_projectID, keccak256(bytes(_releaseName)))));
  }

  /// Returns whether a given address is a member of a team.
  ///
  /// @param _teamID Unique team ID.
  /// @param _member Address of member.
  function isTeamMember(
    uint _teamID,
    address _member
  )
    public
    view
    override
    returns (bool)
  {
    return teamByID[_teamID].members.contains(_member);
  }

  /// Returns whether a given address is a member of a project.
  ///
  /// @param _projectID Unique project ID.
  /// @param _member Address of member.
  function isProjectMember(
    uint _projectID,
    address _member
  )
    public
    view
    override
    returns (bool)
  {
    return projectByID[_projectID].members.contains(_member);
  }

  /// Returns the team metadata URI.
  ///
  /// @param _teamName Name of the team.
  function getTeamMetaURI(
    string memory _teamName
  )
    public
    view
    override
    returns (string memory)
  {
    uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));
    require(bytes(metaByID[teamID]).length > 0, "err-team-not-exist");
    return metaByID[teamID];
  }

  /// Returns the project metadata URI.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  function getProjectMetaURI(
    string memory _teamName,
    string memory _projectName
  )
    public
    view
    override
    returns (string memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    require(bytes(metaByID[projectID]).length > 0, "err-proj-not-exist");
    return metaByID[projectID];
  }

  /// Returns the release metadata URI.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  function getReleaseMetaURI(
    string memory _teamName,
    string memory _projectName,
    string memory _releaseName
  )
    public
    view
    override
    returns (string memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    uint256 releaseID = getReleaseID(projectID, _releaseName);
    require(bytes(metaByID[releaseID]).length > 0, "err-release-not-exist");
    return metaByID[releaseID];
  }

  /// Returns the latest release name.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  function getLatestReleaseName(
    string memory _teamName,
    string memory _projectName
  )
    public
    view
    override
    returns (string memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    Project storage project = projectByID[projectID];
    require(project.releaseNames.length > 0, "err-proj-not-exist");
    return project.releaseNames[project.releaseNames.length - 1];
  }

  /// Returns a paginated list of team names.
  ///
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getTeamNames(
    uint _page,
    uint _size
  )
    public
    view
    override
    returns (string[] memory)
  {
    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > teamNames.length) {
      limit = teamNames.length;
    }
    
    string[] memory values = new string[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = teamNames[i];
    }
    
    return values;
  }

  /// Returns a paginated list of project names.
  ///
  /// @param _teamName Name of the team.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getProjectNames(
    string memory _teamName, 
    uint _page, 
    uint _size
  ) 
    public
    view
    override
    returns (string[] memory)
  {
    uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > teamByID[teamID].projectNames.length) {
      limit = teamByID[teamID].projectNames.length;
    }

    string[] memory values = new string[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = teamByID[teamID].projectNames[i];
    }

    return values;
  }

  /// Returns a paginated list of team members.
  ///
  /// @param _teamName Name of the team.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getTeamMembers(
    string memory _teamName, 
    uint _page, 
    uint _size
  ) 
    public
    view
    override
    returns (address[] memory)
  {
    uint256 teamID = uint(keccak256(abi.encodePacked(block.chainid, keccak256(bytes(_teamName)))));

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > teamByID[teamID].members.length()) {
      limit = teamByID[teamID].members.length();
    }

    address[] memory values = new address[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = teamByID[teamID].members.at(i);
    }

    return values;
  }

  /// Returns a paginated list of project members.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getProjectMembers(
    string memory _teamName,
    string memory _projectName,
    uint _page,
    uint _size
  )
    public
    view
    override
    returns (address[] memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > projectByID[projectID].members.length()) {
      limit = projectByID[projectID].members.length();
    }

    address[] memory values = new address[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = projectByID[projectID].members.at(i);
    }

    return values;
  }

  /// Returns a paginated list of release names.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getReleaseNames(
    string memory _teamName,
    string memory _projectName,
    uint _page,
    uint _size
  )
    public
    view
    override
    returns (string[] memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > projectByID[projectID].releaseNames.length) {
      limit = projectByID[projectID].releaseNames.length;
    }
    
    string[] memory values = new string[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = projectByID[projectID].releaseNames[i];
    }
    
    return values;
  }

  /// Returns a paginated list of release approvers.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getReleaseApprovers(
    string memory _teamName,
    string memory _projectName,
    string memory _releaseName,
    uint _page,
    uint _size
  )
    public
    view
    override
    returns (address[] memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    uint256 releaseID = getReleaseID(projectID, _releaseName);

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > releaseByID[releaseID].approvers.length()) {
      limit = releaseByID[releaseID].approvers.length();
    }

    address[] memory values = new address[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = releaseByID[releaseID].approvers.at(i);
    }
    
    return values;
  }

  /// Returns a paginated list of release rejectors.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getReleaseRejectors(
    string memory _teamName,
    string memory _projectName,
    string memory _releaseName,
    uint _page,
    uint _size
  )
    public
    view
    override
    returns (address[] memory)
  {
    uint256 teamID = getTeamID(_teamName);
    uint256 projectID = getProjectID(teamID, _projectName);
    uint256 releaseID = getReleaseID(projectID, _releaseName);

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > releaseByID[releaseID].rejectors.length()) {
      limit = releaseByID[releaseID].rejectors.length();
    }
    
    address[] memory values = new address[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = releaseByID[releaseID].rejectors.at(i);
    }
    
    return values;
  }
}
