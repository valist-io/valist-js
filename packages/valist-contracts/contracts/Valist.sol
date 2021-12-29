// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;

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
contract Valist {
  using EnumerableSet for EnumerableSet.AddressSet;

  struct Team {
    string metaCID;
    string[] projects;
    EnumerableSet.AddressSet members;
  }

  struct Project {
    string metaCID;
    string[] releases;
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
  mapping(uint256 => Team) teams;
  /// @dev projectID = keccak256(abi.encodePacked(teamID, keccak256(bytes(projectName))))
  mapping(uint256 => Project) projects;
  /// @dev releaseID = keccak256(abi.encodePacked(projectID, keccak256(bytes(releaseName))))
  mapping(uint256 => Release) releases;

  /// @dev emitted when a new team is created
  event TeamCreated(string _teamName, string _metaCID, address _sender);
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

    require(bytes(teams[teamID].metaCID).length == 0, "err-name-claimed");
    require(bytes(_metaCID).length > 0, "err-empty-meta");
    require(bytes(_teamName).length > 0, "err-empty-name");
    require(_members.length > 0, "err-empty-members");

    teams[teamID].metaCID = _metaCID;
    teamNames.push(_teamName);

    for (uint i = 0; i < _members.length; i++) {
      teams[teamID].members.add(_members[i]);
    }

    emit TeamCreated(_teamName, _metaCID, msg.sender);
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

    require(teams[teamID].members.contains(msg.sender), "err-team-member");
    require(bytes(projects[projectID].metaCID).length == 0, "err-name-claimed");
    require(bytes(_metaCID).length > 0, "err-empty-meta");
    require(bytes(_projectName).length > 0, "err-empty-name");

    projects[projectID].metaCID = _metaCID;
    teams[teamID].projects.push(_projectName);

    for (uint i = 0; i < _members.length; i++) {
      projects[projectID].members.add(_members[i]);
    }

    emit ProjectCreated(_teamName, _projectName, _metaCID, msg.sender);
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

    require(projects[projectID].members.contains(msg.sender), "err-proj-member");
    require(bytes(releases[releaseID].metaCID).length == 0, "err-name-claimed");
    require(bytes(_metaCID).length > 0, "err-empty-meta");
    require(bytes(_releaseName).length > 0, "err-empty-name");

    releases[releaseID].metaCID = _metaCID;
    projects[projectID].releases.push(_releaseName);
    emit ReleaseCreated(_teamName, _projectName, _releaseName, _metaCID, msg.sender);
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

    require(bytes(releases[releaseID].metaCID).length > 0, "err-release-not-exist");

    releases[releaseID].approvals.add(msg.sender);
    releases[releaseID].rejections.remove(msg.sender);
    emit ReleaseApproved(_teamName, _projectName, _releaseName, msg.sender);
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

    require(bytes(releases[releaseID].metaCID).length > 0, "err-release-not-exist");

    releases[releaseID].rejections.add(msg.sender);
    releases[releaseID].approvals.remove(msg.sender);
    emit ReleaseRejected(_teamName, _projectName, _releaseName, msg.sender);
  }

  /// Add a member to the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function addTeamMember(string memory _teamName, address _address) public {
    uint256 teamID = uint(keccak256(bytes(_teamName)));
    
    require(teams[teamID].members.contains(msg.sender) == true, "err-team-member");
    require(teams[teamID].members.contains(_address) == false, "err-member-exist");

    teams[teamID].members.add(_address);
    emit TeamMemberAdded(_teamName, _address);
  }

  /// Remove a member from the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function removeTeamMember(string memory _teamName, address _address) public {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

    require(teams[teamID].members.contains(msg.sender) == true, "err-team-member");
    require(teams[teamID].members.contains(_address) == true, "err-member-not-exist");

    teams[teamID].members.remove(_address);
    emit TeamMemberRemoved(_teamName, _address);
  }

  /// Remove the sender from the team and add a new member. Can be used for self
  /// service key rotations, or to transfer membership to a new account. Requires
  /// the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address to rotate to.
  function rotateTeamMember(string memory _teamName, address _address) public {
    uint256 teamID = uint(keccak256(bytes(_teamName)));

    require(teams[teamID].members.contains(msg.sender) == true, "err-team-member");
    require(teams[teamID].members.contains(_address) == false, "err-member-exist");

    teams[teamID].members.remove(msg.sender);
    emit TeamMemberRemoved(_teamName, msg.sender);

    teams[teamID].members.add(_address);
    emit TeamMemberAdded(_teamName, _address);
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
    
    require(teams[teamID].members.contains(msg.sender) == true, "err-team-member");
    require(projects[projectID].members.contains(_address) == false, "err-member-exist");

    projects[projectID].members.add(_address);
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
    
    require(teams[teamID].members.contains(msg.sender) == true, "err-team-member");
    require(projects[projectID].members.contains(_address) == true, "err-member-not-exist"); 
    
    projects[projectID].members.remove(_address);
    emit ProjectMemberRemoved(_teamName, _projectName, _address);   
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
    uint limit = _page * _size;
    if (limit > teamNames.length) {
      limit = teamNames.length;
    }
    
    string[] memory values = new string[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = teamNames[i];
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

    uint limit = _page * _size;
    if (limit > teams[teamID].projects.length) {
      limit = teams[teamID].projects.length;
    }
    
    string[] memory values = new string[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = teams[teamID].projects[i];
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

    uint limit = _page * _size;
    if (limit > teams[teamID].members.length()) {
      limit = teams[teamID].members.length();
    }
    
    address[] memory values = new address[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = teams[teamID].members.at(i);
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

    uint limit = _page * _size;
    if (limit > projects[projectID].members.length()) {
      limit = projects[projectID].members.length();
    }
    
    address[] memory values = new address[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = projects[projectID].members.at(i);
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

    uint limit = _page * _size;
    if (limit > projects[projectID].releases.length) {
      limit = projects[projectID].releases.length;
    }
    
    string[] memory values = new string[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = projects[projectID].releases[i];
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

    uint limit = _page * _size;
    if (limit > releases[releaseID].approvals.length()) {
      limit = releases[releaseID].approvals.length();
    }
    
    address[] memory values = new address[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = releases[releaseID].approvals.at(i);
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

    uint limit = _page * _size;
    if (limit > releases[releaseID].rejections.length()) {
      limit = releases[releaseID].rejections.length();
    }
    
    address[] memory values = new address[](_size);
    for (uint i = _size * _page - _size; i < limit; ++i) {
      values[i] = releases[releaseID].rejections.at(i);
    }
    
    return values;
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
    
    require(bytes(teams[teamID].metaCID).length > 0, "err-team-not-exist");

    return teams[teamID].metaCID;
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
    
    require(bytes(projects[projectID].metaCID).length > 0, "err-proj-not-exist");

    return projects[projectID].metaCID;
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
    
    require(bytes(releases[releaseID].metaCID).length > 0, "err-release-not-exist");

    return releases[releaseID].metaCID;
  }
}
