
import { providers } from 'ethers';
import { Team, Project, Release, Contract } from './index';
import { StorageAPI } from './storage';
import { ContractAPI } from './contract';

import { deployedAddresses } from './contract/evm';
import { createIPFS } from './storage/ipfs';

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

	async createTeam(teamName: string, team: Team, beneficiary: string, members: string[]): Promise<void> {
		const metaURI = await this.storage.writeTeamMeta(team);
		await this.contract.createTeam(teamName, metaURI, beneficiary, members);
	}

	async createProject(teamName: string, projectName: string, project: Project, members: string[]): Promise<void> {
		const metaURI = await this.storage.writeProjectMeta(project);
		await this.contract.createProject(teamName, projectName, metaURI, members);
	}

	async createRelease(teamName: string, projectName: string, releaseName: string, release: Release): Promise<void> {
		const metaURI = await this.storage.writeReleaseMeta(release);
		await this.contract.createRelease(teamName, projectName, releaseName, metaURI);
	}

	async setTeamBeneficiary(teamName: string, beneficiary: string): Promise<void> {
		await this.contract.setTeamBeneficiary(teamName, beneficiary);
	}

	async getTeamBeneficiary(teamName: string): Promise<string> {
		return await this.contract.getTeamBeneficiary(teamName);
	}
}

export const createClient = async ({ web3Provider }: { web3Provider: providers.Web3Provider }): Promise<Client> => {
	const chainID = await web3Provider.getSigner().getChainId();
	const deployedAddress = deployedAddresses[chainID] || deployedAddresses[80001];

	const storage = createIPFS();
	const contract = new Contract.EVM(
		deployedAddress, 
		web3Provider,
	);

	const client = new Client(contract, storage);
	return client;
};
