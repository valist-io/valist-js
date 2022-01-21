/**
 * Valist high level API.
 */
export interface CoreAPI {
	/**
	 * Storage provider.
	 */
	storage: StorageAPI;

	/**
	 * Contract backend.
	 */
	contract: ContractAPI

	/**
	 * Create a new team.
	 * 
	 * @param teamName Unique name used to identify the team.
	 * @param team Team metadata.
	 * @param members List of members to add to the team.
	 */
	createTeam(teamName: string, team: Team, members: string[]): Promise<void>;

	/**
	 * Create a new project. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team to create the project under.
	 * @param projectName Unique name used to identify the project.
	 * @param team Project metadata.
	 * @param members List of members to add to the project.
	 */
	createProject(teamName: string, projectName: string, project: Project, members: string[]): Promise<void>;

	/**
	 * Create a new release. Requires the sender to be a member of the project.
	 * 
	 * @param teamName Name of the team.
	 * @param projectName Name of the project to create the release under.
	 * @param releaseName Unique name used to identify the release.
	 * @param release Release metadata.
	 */
	createRelease(teamName: string, projectName: string, releaseName: string, release: Release): Promise<void>;

		/**
	 * Returns team metadata.
	 * 
	 * @param teamName Name of the team.
	 */
	getTeam(teamName: string): Promise<Team>;

	/**
	 * Returns project metadata.
	 * 
	 * @param teamName Name of the team.
	 * @param projectName Name of the project.
	 */
	getProject(teamName: string, projectName: string): Promise<Project>;

	/**
	 * Returns release metadata.
	 * 
	 * @param teamName Name of the team.
	 * @param projectName Name of the project.
	 * @param releaseName Name of the release.
	 */
	getRelease(teamName: string, projectName: string, releaseName: string): Promise<Release>;
}

/**
 * Contract abstraction API.
 */
export interface ContractAPI {
	/**
	 * Creates a new team with the given members.
	 *
	 * @param teamName Unique name used to identify the team.
  	 * @param metaURI URI of the team metadata.
  	 * @param members List of members to add to the team.
	 */
	createTeam(teamName: string, metaURI: string, members: string[]): Promise<void>;

	/**
	 * Creates a new project. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team to create the project under.
  	 * @param projectName Unique name used to identify the project.
  	 * @param metaURI URI of the project metadata.
	 * @param members Optional list of members to add to the project.
	 */
	createProject(teamName: string, projectName: string, metaURI: string, members: string[]): Promise<void>;

	/**
	 * Creates a new release. Requires the sender to be a member of the project.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param releaseName Unique name used to identify the release.
     * @param metaURI URI of the project metadata.
	 */
	createRelease(teamName: string, projectName: string, releaseName: string, metaURI: string): Promise<void>;

	/**
	 * Adds a member to the team. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team.
     * @param address Address of member.
	 */
	addTeamMember(teamName: string, address: string): Promise<void>;
	
	/**
	 * Removes a member from the team. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team.
     * @param address Address of member.
	 */
	removeTeamMember(teamName: string, address: string): Promise<void>;
	
	/**
	 * Adds a member to the project. Requires the sender to be a member of the team.
	 *
	 * @param teamName Name of the team.
  	 * @param projectName Name of the project.
  	 * @param address Address of member.
	 */
	addProjectMember(teamName: string, projectName: string, address: string): Promise<void>;
	
	/**
	 * Removes a member from the project. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param address Address of member.
	 */
	removeProjectMember(teamName: string, projectName: string, address: string): Promise<void>;
	
	/**
	 * Sets the team metadata content ID. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team.
     * @param metaURI Metadata URI.
	 */
	setTeamMetaURI(teamName: string, metaURI: string): Promise<void>;
	
	/**
	 * Sets the project metadata content ID. Requires the sender to be a member of the team.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param metaURI Metadata URI.
	 */
	setProjectMetaURI(teamName: string, projectName: string, metaURI: string): Promise<void>;

	/**
	 * Approves the release by adding the sender's address to the approvers list.
	 * The sender's address will be removed from the rejectors list if it exists.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param releaseName Name of the release.
	 */
	approveRelease(teamName: string, projectName: string, releaseName: string): Promise<void>;
	
	/**
	 * Rejects the release by adding the sender's address to the rejectors list.
	 * The sender's address will be removed from the approvers list if it exists.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param releaseName Name of the release.
	 */
	rejectRelease(teamName: string, projectName: string, releaseName: string): Promise<void>;

	/**
	 * Returns the latest release name.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
	 */
	getLatestReleaseName(teamName: string, projectName: string): Promise<string>;

	/** 
	 * Returns the team metadata URI.
	 * 
	 * @param teamName Name of the team.
	 */
	getTeamMetaURI(teamName: string): Promise<string>;

	/**
	 * Returns the project metadata URI.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
	 */
	getProjectMetaURI(teamName: string, projectName: string): Promise<string>;

	/**
	 * Returns the release metadata URI.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param releaseName Name of the release.
	 */
	getReleaseMetaURI(teamName: string, projectName: string, releaseName: string): Promise<string>;

	/**
	 * Returns a paginated list of team names.
	 * 
	 * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getTeamNames(page: number, size: number): Promise<string[]>;

	/**
	 * Returns a paginated list of project names.
	 * 
	 * @param teamName Name of the team.
     * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getProjectNames(teamName: string, page: number, size: number): Promise<string[]>;

	/**
	 * Returns a paginated list of release names.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getReleaseNames(teamName: string, projectName: string, page: number, size: number): Promise<string[]>;
	
	/**
	 * Returns a paginated list of team members.
	 * 
     * @param teamName Name of the team.
     * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getTeamMembers(teamName: string, page: number, size: number): Promise<string[]>;
	
	/**
	 * Returns a paginated list of project members.
	 * 
     * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getProjectMembers(teamName: string, projectName: string, page: number, size: number): Promise<string[]>;
	
	/**
	 * Returns a paginated list of release approvers.
	 * 
     * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param releaseName Name of the release.
     * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getReleaseApprovers(teamName: string, projectName: string, releaseName: string, page: number, size: number): Promise<string[]>;
	
	/**
	 * Returns a paginated list of release rejectors.
	 * 
	 * @param teamName Name of the team.
     * @param projectName Name of the project.
     * @param releaseName Name of the release.
     * @param page Page to return items from.
     * @param size Number of items to return.
	 */
	getReleaseRejectors(teamName: string, projectName: string, releaseName: string, page: number, size: number): Promise<string[]>;
}

/**
 * Storage abstraction API.
 */
export interface StorageAPI {
	/**
	 * Read team metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readTeamMeta(metaURI: string): Promise<Team>;

	/**
	 * Read project metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readProjectMeta(metaURI: string): Promise<Project>;

	/**
	 * Read release metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readReleaseMeta(metaURI: string): Promise<Release>;

	/**
	 * Write team metadata to storage and return its URI.
	 * 
	 * @param team Team metadata.
	 */
	writeTeamMeta(team: Team): Promise<string>;

	/**
	 * Write project metadata to storage and return its URI.
	 * 
	 * @param project Project metadata.
	 */
	writeProjectMeta(project: Project): Promise<string>;
	
	/**
	 * Write release metadata to storage and return its URI.
	 * 
	 * @param release Release metadata.
	 */
	writeReleaseMeta(release: Release): Promise<string>;

	/**
	 * Write data to storage and return its URI.
	 * 
	 * @param data File or string to write.
	 */
	write(data: File | string): Promise<string> 

	/**
	 * Read data from storage.
	 * 
	 * @param uri URI of data.
	 */
	read(uri: string): Promise<string>
}

export class Team {
	/** team friendly name. */
	public name?: string;
	/** short description of the team. */
	public description?: string;
	/** link to the team website. */
	public homepage?: string;
}

export class Project {
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public description?: string;
	/** link to the project website. */
	public homepage?: string;
	/** source code url for the project. */
	public repository?: string;
}

export class Release {
	/** full release name. */
	public name?: string;
	/** release version. */
	public version?: string;
	/** readme contents. */
	public readme?: string;
	/** license type. */
	public license?: string;
	/** list of dependencies. */
	public dependencies?: string[];
	/** mapping of names to artifacts. */
	public artifacts?: Map<string, Artifact>;
}

export class Artifact {
	/** SHA256 hash of the file. */
	public sha256?: string;
	/** path to the artifact file. */
	public provider?: string;
}
