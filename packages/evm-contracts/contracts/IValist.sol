// SPDX-License-Identifier: MPL-2.0
pragma solidity >=0.8.4;

interface IValist {

  /// @dev emitted when a new team is created
  event TeamCreated(string _teamName, string _metaURI, address _sender);
  /// @dev emitted when an exsting team is updated
  event TeamUpdated(string _teamName, string _metaURI, address _member);
  /// @dev emitted when a new team member is added
  event TeamMemberAdded(string _teamName, address _member);
  /// @dev emitted when an existing team member is removed
  event TeamMemberRemoved(string _teamName, address _member);

  /// @dev emitted when a new project is created
  event ProjectCreated(
    string _teamName, 
    string _projectName, 
    string _metaURI, 
    address _member
  );

  /// @dev emitted when an existing project is updated
  event ProjectUpdated(
    string _teamName,
    string _projectName,
    string _metaURI,
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
    string _metaURI, 
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
  /// @param _metaURI URI of the team metadata.
  /// @param _members List of members to add to the team.
  function createTeam(
    string memory _teamName, 
    string memory _metaURI, 
    address[] memory _members
  ) 
    external;
  
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
    external;

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
    external;

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
    external;

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
    external;

  /// Add a member to the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function addTeamMember(string memory _teamName, address _address) external;

  /// Remove a member from the team. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _address Address of member.
  function removeTeamMember(string memory _teamName, address _address) external;

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
    external;

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
    external;

  /// Sets the team metadata URI. Requires the sender to be a member of the team.
  ///
  /// @param _teamName Name of the team.
  /// @param _metaURI Metadata URI.
  function setTeamMetaURI(
    string memory _teamName,
    string memory _metaURI
  )
    external;

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
    external;

  /// Returns the team metadata URI.
  ///
  /// @param _teamName Name of the team.
  function getTeamMetaURI(
    string memory _teamName
  )
    external
    view
    returns (string memory);

  /// Returns the project metadata URI.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  function getProjectMetaURI(
    string memory _teamName,
    string memory _projectName
  )
    external
    view
    returns (string memory);

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
    external
    view
    returns (string memory);

  /// Returns the latest release name.
  ///
  /// @param _teamName Name of the team.
  /// @param _projectName Name of the project.
  function getLatestReleaseName(
    string memory _teamName,
    string memory _projectName
  )
    external
    view
    returns (string memory);

  /// Returns a paginated list of team names.
  ///
  /// @param _page Page to return items from.
  /// @param _size Number of items to return.
  function getTeamNames(
    uint _page,
    uint _size
  )
    external
    view
    returns (string[] memory);

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
    external
    view
    returns (string[] memory);

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
    external
    view
    returns (address[] memory);

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
    external
    view
    returns (address[] memory);

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
    external
    view
    returns (string[] memory);

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
    external
    view
    returns (address[] memory);

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
    external
    view
    returns (address[] memory);
}