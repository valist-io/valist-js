import { CoreAPI, StorageAPI, ContractAPI, Team, Project, Release } from './types';
import { IPFS } from './storage';
import { EVM } from './contract';

export class Valist implements CoreAPI {
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