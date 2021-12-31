// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title Valist registry contract
///
/// @custom:err-empty-meta metadata CID is required
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
contract Valist is ERC2771Context {
  using EnumerableSet for EnumerableSet.AddressSet;

  struct Team {
    string metaCID;
    string[] projectNames;
    EnumerableSet.AddressSet members;
  }

  struct Project {
    string metaCID;
    string[] releaseNames;
    EnumerableSet.AddressSet members;
  }

  struct Release {
    string metaCID;
    EnumerableSet.AddressSet approvals;
    EnumerableSet.AddressSet rejections;
  }

  /// @dev list of all team names
  string[] teamNames;

  /// @dev teamID = keccak256(bytes(teamName))
  mapping(uint256 => Team) teamByID;
  /// @dev projectID = keccak256(abi.encodePacked(teamID, keccak256(bytes(projectName))))
  mapping(uint256 => Project) projectByID;
  /// @dev releaseID = keccak256(abi.encodePacked(projectID, keccak256(bytes(releaseName))))
  mapping(uint256 => Release) releaseByID;

  /// @dev emitted when a new team is created
  event TeamCreated(string _teamName, string _metaCID, address _sender);
  /// @dev emitted when an exsting team is updated
  event TeamUpdated(string _teamName, string _metaCID, address _member);
  /// @dev emitted when a new team member is added
  event TeamMemberAdded(string _teamName, address _member);
  /// @dev emitted when an existing team member is removed
  event TeamMemberRemoved(string _teamName, address _member);

  /// @dev emitted when a new project is created
  event ProjectCreated(
    string _teamName, 
    string _projectName, 
    string _metaCID, 
    address _member
  );

  /// @dev emitted when an existing project is updated
  event ProjectUpdated(
    string _teamName,
    string _projectName,
    string _metaCID,
    address _member
  );

  /// @dev emitted when a new project member is added
  event ProjectMemberAdded(
    string _teamName, 
    string _projectName, 
    address _member
  );

  /// @dev emitted when an existing project member is removed
  event ProjectMemberRemoved(
    string _teamName, 
    string _projectName, 
    address _member
  );

  /// @dev emitted when a new release is created
  event ReleaseCreated(
    string _teamName, 
    string _projectName, 
    string _releaseName, 
    string _metaCID, 
    address _member
  );

  /// @dev emitted when an existing release is approved by a signer
  event ReleaseApproved(
    string _teamName, 
    string _projectName, 
    string _releaseName, 
    address _sender
  );

  /// @dev emitted when an existing release is rejected by a signer
  event ReleaseRejected(
    string _teamName, 
    string _projectName, 
    string _releaseName, 
    address _sender
  );

  /// @dev version of BaseRelayRecipient this contract implements
  string public versionRecipient = "2.2.0";

  /// Creates a Valist registry.
  ///
  /// @param _trustedForwarder Address for meta transactions.
  constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {}

  /// Creates a new team with the given members.
  ///
  /// @param _teamName Unique name used to identify the team.
  /// @param _metaCID Content ID of the team metadata.
  /// @param _members List of members to add to the team.
  function createTeam(
    string memory _teamName, 
    string memory _metaCID, 
    address[] memory _members
  ) 
    public 
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

    require(bytes(teamByID[teamID].metaCID).length == 0, "err-name-claimed");
    require(bytes(_metaCID).length > 0, "err-empty-meta");
    require(bytes(_teamName).length > 0, "err-empty-name");
    require(_members.length > 0, "err-empty-members");

    teamByID[teamID].metaCID = _metaCID;
    teamNames.push(_teamName);

    for (uint i = 0; i < _members.length; i++) {
      teamByID[teamID].members.add(_members[i]);
    }

    emit TeamCreated(_teamName, _metaCID, _msgSender());
  }
  
  /// Creates a new project. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team to create the project under.
  /// @param _projectName Unique name used to identify the project.
  /// @param _metaCID Content ID of the project metadata.
  /// @param _members Optional list of members to add to the project.
  function createProject(
    string memory _teamName, 
    string memory _projectName,
    string memory _metaCID,
    address[] memory _members
  )
    public
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));

    require(teamByID[teamID].members.contains(_msgSender()), "err-team-member");
    require(bytes(projectByID[projectID].metaCID).length == 0, "err-name-claimed");
    require(bytes(_metaCID).length > 0, "err-empty-meta");
    require(bytes(_projectName).length > 0, "err-empty-name");

    projectByID[projectID].metaCID = _metaCID;
    teamByID[teamID].projectNames.push(_projectName);

    for (uint i = 0; i < _members.length; i++) {
      projectByID[projectID].members.add(_members[i]);
    }

    emit ProjectCreated(_teamName, _projectName, _metaCID, _msgSender());
  }

  /// Creates a new release. Requires the sender to be a member of the project.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Unique name used to identify the release.
  /// @param _metaCID Content ID of the project metadata.
  function createRelease(
    string memory _teamName, 
    string memory _projectName,
    string memory _releaseName,
    string memory _metaCID
  )
    public 
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(_releaseName)))));

    require(projectByID[projectID].members.contains(_msgSender()), "err-proj-member");
    require(bytes(releaseByID[releaseID].metaCID).length == 0, "err-name-claimed");
    require(bytes(_metaCID).length > 0, "err-empty-meta");
    require(bytes(_releaseName).length > 0, "err-empty-name");

    releaseByID[releaseID].metaCID = _metaCID;
    projectByID[projectID].releaseNames.push(_releaseName);
    emit ReleaseCreated(_teamName, _projectName, _releaseName, _metaCID, _msgSender());
  }

  /// Approve the release by adding the sender's address to the approvals list.
  /// The sender's address will be removed from the rejections list if it exists.
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
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(_releaseName)))));

    require(bytes(releaseByID[releaseID].metaCID).length > 0, "err-release-not-exist");

    releaseByID[releaseID].approvals.add(_msgSender());
    releaseByID[releaseID].rejections.remove(_msgSender());
    emit ReleaseApproved(_teamName, _projectName, _releaseName, _msgSender());
  }

  /// Reject the release by adding the sender's address to the rejections list.
  /// The sender's address will be removed from the approvals list if it exists.
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
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(_releaseName)))));

    require(bytes(releaseByID[releaseID].metaCID).length > 0, "err-release-not-exist");

    releaseByID[releaseID].rejections.add(_msgSender());
    releaseByID[releaseID].approvals.remove(_msgSender());
    emit ReleaseRejected(_teamName, _projectName, _releaseName, _msgSender());
  }

  /// Add a member to the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function addTeamMember(string memory _teamName, address _address) public {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    
    require(teamByID[teamID].members.contains(_msgSender()) == true, "err-team-member");
    require(teamByID[teamID].members.contains(_address) == false, "err-member-exist");

    teamByID[teamID].members.add(_address);
    emit TeamMemberAdded(_teamName, _address);
  }

  /// Remove a member from the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function removeTeamMember(string memory _teamName, address _address) public {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

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
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    
    require(bytes(projectByID[projectID].metaCID).length > 0, "err-proj-not-exist");
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
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    
    require(bytes(projectByID[projectID].metaCID).length > 0, "err-proj-not-exist");
    require(teamByID[teamID].members.contains(_msgSender()) == true, "err-team-member");
    require(projectByID[projectID].members.contains(_address) == true, "err-member-not-exist"); 

    projectByID[projectID].members.remove(_address);
    emit ProjectMemberRemoved(_teamName, _projectName, _address);   
  }

  /// Sets the team metadata content ID. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _metaCID Metadata content ID.
  function setTeamMetaCID(
    string memory _teamName,
    string memory _metaCID
  )
    public
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

    require(teamByID[teamID].members.contains(_msgSender()), "err-team-member");
    require(bytes(teamByID[teamID].metaCID).length > 0, "err-team-not-exist");
    require(bytes(_metaCID).length > 0, "err-empty-meta");

    teamByID[teamID].metaCID = _metaCID;
    emit TeamUpdated(_teamName, _metaCID, _msgSender());
  }

  /// Sets the project metadata content ID. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _metaCID Metadata content ID.
  function setProjectMetaCID(
    string memory _teamName,
    string memory _projectName,
    string memory _metaCID
  )
    public
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));

    require(teamByID[teamID].members.contains(_msgSender()), "err-team-member");
    require(bytes(projectByID[projectID].metaCID).length > 0, "err-proj-not-exist");
    require(bytes(_metaCID).length > 0, "err-empty-meta");

    projectByID[projectID].metaCID = _metaCID;
    emit ProjectUpdated(_teamName, _projectName, _metaCID, _msgSender());
  }

  /// Returns the team metadata CID.
  ///
  /// @param _teamName Name of the team.
  function getTeamMetaCID(
    string memory _teamName
  )
    public
    view
    returns (string memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    return teamByID[teamID].metaCID;
  }

  /// Returns the project metadata CID.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  function getProjectMetaCID(
    string memory _teamName,
    string memory _projectName
  )
    public
    view
    returns (string memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    return projectByID[projectID].metaCID;
  }

  /// Returns the release metadata CID.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  function getReleaseMetaCID(
    string memory _teamName,
    string memory _projectName,
    string memory _releaseName
  )
    public
    view
    returns (string memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(_releaseName)))));
    return releaseByID[releaseID].metaCID;
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
    returns (string memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    Project storage project = projectByID[projectID];
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
    returns (string[] memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

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
    returns (address[] memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

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
    returns (address[] memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));

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
    returns (string[] memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));

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

  /// Returns a paginated list of release approvals.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getReleaseApprovals(
    string memory _teamName,
    string memory _projectName,
    string memory _releaseName,
    uint _page,
    uint _size
  )
    public
    view
    returns (address[] memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(_releaseName)))));

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > releaseByID[releaseID].approvals.length()) {
      limit = releaseByID[releaseID].approvals.length();
    }

    address[] memory values = new address[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = releaseByID[releaseID].approvals.at(i);
    }
    
    return values;
  }

  /// Returns a paginated list of release rejections.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  /// @param _releaseName Name of the release.
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getReleaseRejections(
    string memory _teamName,
    string memory _projectName,
    string memory _releaseName,
    uint _page,
    uint _size
  )
    public
    view
    returns (address[] memory)
  {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    uint256 projectID = uint(keccak256(abi.encodePacked(teamID, keccak256(bytes(_projectName)))));
    uint256 releaseID = uint(keccak256(abi.encodePacked(projectID, keccak256(bytes(_releaseName)))));

    uint start = _page * _size;
    uint limit = start + _size;

    if (limit > releaseByID[releaseID].rejections.length()) {
      limit = releaseByID[releaseID].rejections.length();
    }
    
    address[] memory values = new address[](limit - start);
    for (uint i = start; i < limit; ++i) {
      values[i - start] = releaseByID[releaseID].rejections.at(i);
    }
    
    return values;
  }
}
