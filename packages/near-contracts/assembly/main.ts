import { PersistentMap, PersistentVector, math, util, context } from 'near-sdk-as';
import { Team, Project, Release } from './model';

const teamNames = new PersistentVector<string>("teamNames");
const teamByID = new PersistentMap<u32, Team>("teamByID");
const projectByID = new PersistentMap<u32, Project>("projectByID");
const releaseByID = new PersistentMap<u32, Release>("releaseByID");
const metaByID = new PersistentMap<u32, string>("metaByID");

/**
 * Creates a new team with the given members.
 * 
 * @param teamName Unique name used to identify the team.
 * @param metaURI URI of the team metadata.
 * @param members List of members to add to the team.
 */
export function createTeam(teamName: string, metaURI: string, members: Set<string>): void {
	const teamID = getTeamID(teamName);

	assert(!metaByID.contains(teamID), "err-name-claimed");
	assert(metaURI.length > 0, "err-empty-meta");
	assert(teamName.length > 0, "err-empty-name");
	assert(members.size > 0, "err-empty-members");

 	metaByID.set(teamID, metaURI);
    teamNames.push(teamName);

    const team = new Team(members);
    teamByID.set(teamID, team);
}

/** Creates a new project. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team to create the project under.
 * @param projectName Unique name used to identify the project.
 * @param metaURI URI of the project metadata.
 * @param members Optional list of members to add to the project.
 */
export function createProject(teamName: string, projectName: string, metaURI: string, members: Set<string>): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(!metaByID.contains(projectID), "err-name-claimed");
	assert(metaURI.length > 0, "err-empty-meta");
	assert(projectName.length > 0, "err-empty-name");

 	metaByID.set(projectID, metaURI);
 	team.projectNames.push(projectName);
 	teamByID.set(teamID, team);

 	const project = new Project(members);
 	projectByID.set(projectID, project);
}

/**
 * Creates a new release. Requires the sender to be a member of the project.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param releaseName Unique name used to identify the release.
 * @param metaURI URI of the project metadata.
 */
export function createRelease(teamName: string, projectName: string, releaseName: string, metaURI: string): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	const releaseID = getReleaseID(projectID, releaseName);

	assert(projectByID.contains(projectID), "err-proj-not-exist");
	const project = projectByID.getSome(projectID);

	assert(project.members.has(context.sender), "err-proj-member");
	assert(!metaByID.contains(releaseID), "err-name-claimed");
	assert(metaURI.length > 0, "err-empty-meta");
	assert(releaseName.length > 0, "err-empty-name");

	metaByID.set(releaseID, metaURI);
	project.releaseNames.push(releaseName);
	projectByID.set(projectID, project);

    const release = new Release();
    releaseByID.set(releaseID, release);
}

/**
 * Approve the release by adding the sender's address to the approvers list.
 * The sender's address will be removed from the rejectors list if it exists.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param releaseName Name of the release.
 */
export function approveRelease(teamName: string, projectName: string, releaseName: string): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	const releaseID = getReleaseID(projectID, releaseName);

	assert(releaseByID.contains(releaseID), "err-release-not-exist");
	const release = releaseByID.getSome(releaseID);

	release.approvers.add(context.sender);
	release.rejectors.delete(context.sender);
	releaseByID.set(releaseID, release);
}

/**
 * Reject the release by adding the sender's address to the rejectors list.
 * The sender's address will be removed from the approvers list if it exists.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param releaseName Name of the release.
 */
export function rejectRelease(teamName: string, projectName: string, releaseName: string): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	const releaseID = getReleaseID(projectID, releaseName);

	assert(releaseByID.contains(releaseID), "err-release-not-exist");
	const release = releaseByID.getSome(releaseID);

	release.rejectors.add(context.sender);
	release.approvers.delete(context.sender);
	releaseByID.set(releaseID, release);
}

/**
 * Add a member to the team. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team.
 * @param address Address of member.
 */
export function addTeamMember(teamName: string, address: string): void {
 	const teamID = getTeamID(teamName);

 	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(!team.members.has(address), "err-member-exist");

	team.members.add(address);
	teamByID.set(teamID, team);
}

/**
 * Remove a member from the team. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team.
 * @param address Address of member.
 */
export function removeTeamMember(teamName: string, address: string): void {
 	const teamID = getTeamID(teamName);

 	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(team.members.has(address), "err-member-not-exist");

	team.members.delete(address);
	teamByID.set(teamID, team);
}

/**
 * Add a member to the project. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param address Address of member.
 */
export function addProjectMember(teamName: string, projectName: string, address: string): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(projectByID.contains(projectID), "err-proj-not-exist");
	const project = projectByID.getSome(projectID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(!project.members.has(address), "err-member-exist");

	project.members.add(address);
	projectByID.set(projectID, project);
}

/**
 * Remove a member from the project. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param address Address of member.
 */
export function removeProjectMember(teamName: string, projectName: string, address: string): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(projectByID.contains(projectID), "err-proj-not-exist");
	const project = projectByID.getSome(projectID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(project.members.has(address), "err-member-not-exist");

	project.members.delete(address);
	projectByID.set(projectID, project);
}

/**
 * Sets the team metadata URI. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team.
 * @param metaURI Metadata URI.
 */
export function setTeamMetaURI(teamName: string, metaURI: string): void {
	const teamID = getTeamID(teamName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(metaURI.length > 0, "err-empty-meta");

	metaByID.set(teamID, metaURI);
}

/**
 * Sets the project metadata URI. Requires the sender to be a member of the team.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param metaURI Metadata URI.
 */
export function setProjectMetaURI(teamName: string, projectName: string, metaURI: string): void {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	assert(team.members.has(context.sender), "err-team-member");
	assert(metaByID.contains(projectID), "err-proj-not-exist");

	metaByID.set(projectID, metaURI);
}

/**
 * Returns the team metadata URI.
 *
 * @param teamName Name of the team.
 */
export function getTeamMetaURI(teamName: string): string {
	const teamID = getTeamID(teamName);
	assert(metaByID.contains(teamID), "err-team-not-exist");
	return metaByID.getSome(teamID);
}

/**
 * Returns the project metadata URI.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 */
export function getProjectMetaURI(teamName: string, projectName: string): string {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	assert(metaByID.contains(projectID), "err-proj-not-exist");
	return metaByID.getSome(projectID);
}

/**
 * Returns the release metadata URI.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param releaseName Name of the release.
 */
export function getReleaseMetaURI(teamName: string, projectName: string, releaseName: string): string {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	const releaseID = getReleaseID(projectID, releaseName);
	assert(metaByID.contains(releaseID), "err-release-not-exist");
	return metaByID.getSome(releaseID);
}

/**
 * Returns the latest release name.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 */
export function getLatestReleaseName(teamName: string, projectName: string): string {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	
	assert(projectByID.contains(projectID), "err-proj-not-exist");
	const project = projectByID.getSome(projectID);

	assert(project.releaseNames.length > 0, "err-release-not-exist");
	return project.releaseNames[project.releaseNames.length - 1];
}

/**
 * Returns a paginated list of team names.
 *
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getTeamNames(page: i32, size: i32): Array<string> {
	let start = page * size;
    let limit = start + size;

    if (limit > teamNames.length) {
      limit = teamNames.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(teamNames[i]);
    }
    
    return values;
}

/**
 * Returns a paginated list of project names.
 *
 * @param teamName Name of the team.
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getProjectNames(teamName: string, page: i32, size: i32): Array<string> {
	const teamID = getTeamID(teamName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	let start = page * size;
    let limit = start + size;

    if (limit > team.projectNames.length) {
      limit = team.projectNames.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(team.projectNames[i]);
    }
    
    return values;
}

/**
 * Returns a paginated list of release names.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getReleaseNames(teamName: string, projectName: string, page: i32, size: i32): Array<string> {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	
	assert(projectByID.contains(projectID), "err-proj-not-exist");
	const project = projectByID.getSome(projectID);

	let start = page * size;
    let limit = start + size;

    if (limit > project.releaseNames.length) {
      limit = project.releaseNames.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(project.releaseNames[i]);
    }
    
    return values;
}

/**
 * Returns a paginated list of team members.
 *
 * @param teamName Name of the team.
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getTeamMembers(teamName: string, page: i32, size: i32): Array<string> {
	const teamID = getTeamID(teamName);

	assert(teamByID.contains(teamID), "err-team-not-exist");
	const team = teamByID.getSome(teamID);

	let start = page * size;
    let limit = start + size;

    const members = team.members.values();
    if (limit > members.length) {
      limit = members.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(members[i]);
    }
    
    return values;
}

/**
 * Returns a paginated list of project members.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getProjectMembers(teamName: string, projectName: string, page: i32, size: i32): Array<string> {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	
	assert(projectByID.contains(projectID), "err-proj-not-exist");
	const project = projectByID.getSome(projectID);

	let start = page * size;
    let limit = start + size;

    const members = project.members.values();
    if (limit > members.length) {
      limit = members.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(members[i]);
    }
    
    return values;
}

/**
 * Returns a paginated list of release approvers.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param releaseName Name of the release.
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getReleaseApprovers(teamName: string, projectName: string, releaseName: string, page: i32, size: i32): Array<string> {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	const releaseID = getReleaseID(projectID, releaseName);
	
	assert(releaseByID.contains(releaseID), "err-release-not-exist");
	const release = releaseByID.getSome(releaseID);

	let start = page * size;
    let limit = start + size;

    const approvers = release.approvers.values();
    if (limit > approvers.length) {
      limit = approvers.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(approvers[i]);
    }
    
    return values;
}

/**
 * Returns a paginated list of release rejectors.
 *
 * @param teamName Name of the team.
 * @param projectName Name of the project.
 * @param releaseName Name of the release.
 * @param page Page to return items from.
 * @param size Number of items to return.
 */
export function getReleaseRejectors(teamName: string, projectName: string, releaseName: string, page: i32, size: i32): Array<string> {
	const teamID = getTeamID(teamName);
	const projectID = getProjectID(teamID, projectName);
	const releaseID = getReleaseID(projectID, releaseName);
	
	assert(releaseByID.contains(releaseID), "err-release-not-exist");
	const release = releaseByID.getSome(releaseID);

	let start = page * size;
    let limit = start + size;

    const rejectors = release.rejectors.values();
    if (limit > rejectors.length) {
      limit = rejectors.length;
    }
    
    const values = new Array<string>();
    for (let i = start; i < limit; ++i) {
      values.push(rejectors[i]);
    }
    
    return values;
}

/**
 * Returns the ID of the team with the given name.
 * 
 * @param teamName Name of the team.
 */
export function getTeamID(teamName: string): u32 {
	const salt = util.stringToBytes("NEAR");
	const data = util.stringToBytes(teamName);
	const hash = math.keccak256(_concatUint8Array(salt, data));
	return _uint8ArrayToU32(hash);
}

/**
 * Returns the ID of the project under the team with the given name.
 * 
 * @param teamID Unique ID of the team.
 * @param projectName Name of the project.
 */
export function getProjectID(teamID: u32, projectName: string): u32 {
	const salt = _u32ToUint8Array(teamID);
	const data = util.stringToBytes(projectName);
	const hash = math.keccak256(_concatUint8Array(salt, data));
	return _uint8ArrayToU32(hash);
}

/**
 * Returns the ID of the release under the project with the given name.
 * 
 * @param projectID Unique ID of the project.
 * @param releaseName Name of the release.
 */
export function getReleaseID(projectID: u32, releaseName: string): u32 {
	const salt = _u32ToUint8Array(projectID);
	const data = util.stringToBytes(releaseName);
	const hash = math.keccak256(_concatUint8Array(salt, data));
	return _uint8ArrayToU32(hash);
}

function _u32ToUint8Array(data: u32): Uint8Array {
	const res = new Uint8Array(4);
	res[0] = 0xff & (data >> 24);
	res[1] = 0xff & (data >> 16);
	res[2] = 0xff & (data >> 8);
	res[3] = 0xff & (data >> 0);
	return res;
}

function _uint8ArrayToU32(data: Uint8Array): u32 {
	let res = u32(0);
	res |= (0xff & data[0]) << 24;
	res |= (0xff & data[1]) << 16;
	res |= (0xff & data[2]) << 8;
	res |= (0xff & data[3]) << 0;
	return res;
}

function _concatUint8Array(a: Uint8Array, b: Uint8Array): Uint8Array {
	const res = new Uint8Array(a.length + b.length);
	res.set(a);
	res.set(b, a.length);
	return res;
}
