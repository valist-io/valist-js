import { Team, Project, Release } from './index';
import { StorageAPI } from './storage';
import { ContractAPI } from './contract';

export class Client {
	public contract: ContractAPI;
	public storage: StorageAPI;

	constructor(contract: ContractAPI, storage: StorageAPI) {
		this.contract = contract;
		this.storage = storage;
	}

	async getTeam(teamName: string): Promise<Team> {
		const metaURI = await this.contract.getTeamMetaURI(teamName);
		return await this.storage.readTeamMeta(metaURI);
	}

	async getProject(teamName: string, projectName: string): Promise<Project> {
		const metaURI = await this.contract.getProjectMetaURI(teamName, projectName);
		return await this.storage.readProjectMeta(metaURI);
	}

	async getRelease(teamName: string, projectName: string, releaseName: string): Promise<Release> {
		const metaURI = await this.contract.getReleaseMetaURI(teamName, projectName, releaseName);
		return await this.storage.readReleaseMeta(metaURI);
	}

	async getLatestRelease(teamName: string, projectName: string): Promise<Release> {
		const releaseName = await this.contract.getLatestReleaseName(teamName, projectName);
		return await this.getRelease(teamName, projectName, releaseName);
	}

	async createTeam(teamName: string, team: Team, members: string[]): Promise<void> {
		const metaURI = await this.storage.writeTeamMeta(team);
		await this.contract.createTeam(teamName, metaURI, members);
	}

	async createProject(teamName: string, projectName: string, project: Project, members: string[]): Promise<void> {
		const metaURI = await this.storage.writeProjectMeta(project);
		await this.contract.createProject(teamName, projectName, metaURI, members);
	}

	async createRelease(teamName: string, projectName: string, releaseName: string, release: Release): Promise<void> {
		const metaURI = await this.storage.writeReleaseMeta(release);
		await this.contract.createRelease(teamName, projectName, releaseName, metaURI);
	}
}