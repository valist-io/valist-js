import { EVM } from './evm';

/**
 * Contract abstraction API.
 */
interface ContractAPI {
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

	/**
	 * Generates teamID from teamName.
	 *
	 * @param teamName Name of the team.
	 */
	getTeamID(teamName: string): Promise<number>;

	/**
	 * Generates projectID from teamID and projectName.
	 *
	 * @param teamID Unique team ID.
	 * @param projectName Name of the project.
	 */
	getProjectID(teamID: number, projectName: string): Promise<number>;

	/**
	 * Generates releaseID from projectID and releaseName.
	 *
	 * @param projectID Unique project ID.
	 * @param releaseName Name of the release.
	 */
	getReleaseID(projectID: number, releaseName: string): Promise<number>;
}

export { ContractAPI, EVM };