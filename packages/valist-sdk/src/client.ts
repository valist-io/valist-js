import { providers, BigNumberish } from 'ethers';
import { TeamMeta, ProjectMeta, ReleaseMeta, LicenseMeta, Contract } from './index';
import { StorageAPI } from './storage';
import { ContractAPI, TransactionAPI } from './contract';

import { valistAddresses, licenseAddresses } from './contract/evm';
import { createIPFS } from './storage/ipfs';

export class Client {
	public contract: ContractAPI;
	public storage: StorageAPI;

	constructor(contract: ContractAPI, storage: StorageAPI) {
		this.contract = contract;
		this.storage = storage;
	}

	async getTeamMeta(teamName: string): Promise<TeamMeta> {
		const metaURI = await this.contract.getTeamMetaURI(teamName);
		return await this.storage.readTeamMeta(metaURI);
	}

	async getProjectNames(teamName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.getProjectNames(teamName, page, size);
	}

	async getProjectMeta(teamName: string, projectName: string): Promise<ProjectMeta> {
		const metaURI = await this.contract.getProjectMetaURI(teamName, projectName);
		return await this.storage.readProjectMeta(metaURI);
	}

	async getReleaseMeta(teamName: string, projectName: string, releaseName: string): Promise<ReleaseMeta> {
		const metaURI = await this.contract.getReleaseMetaURI(teamName, projectName, releaseName);
		return await this.storage.readReleaseMeta(metaURI);
	}

	async getLatestReleaseMeta(teamName: string, projectName: string): Promise<ReleaseMeta> {
		const releaseName = await this.contract.getLatestReleaseName(teamName, projectName);
		return await this.getReleaseMeta(teamName, projectName, releaseName);
	}

	async getLicenseMeta(teamName: string, projectName: string, licenseName: string): Promise<LicenseMeta> {
		const metaURI = await this.contract.getLicenseMetaURI(teamName, projectName, licenseName);
		return await this.storage.readLicenseMeta(metaURI);
	}

	async createTeam(teamName: string, team: TeamMeta, beneficiary: string, members: string[]): Promise<TransactionAPI> {
		const metaURI = await this.storage.writeTeamMeta(team);
		return this.contract.createTeam(teamName, metaURI, beneficiary, members);
	}

	async createProject(teamName: string, projectName: string, project: ProjectMeta, members: string[]): Promise<TransactionAPI> {
		const metaURI = await this.storage.writeProjectMeta(project);
		return this.contract.createProject(teamName, projectName, metaURI, members);
	}

	async createRelease(teamName: string, projectName: string, releaseName: string, release: ReleaseMeta): Promise<TransactionAPI> {
		const metaURI = await this.storage.writeReleaseMeta(release);
		return this.contract.createRelease(teamName, projectName, releaseName, metaURI);
	}

	async createLicense(teamName: string, projectName: string, licenseName: string, license: LicenseMeta, mintPrice: BigNumberish): Promise<TransactionAPI> {
		const metaURI = await this.storage.writeLicenseMeta(license);
		return this.contract.createLicense(teamName, projectName, licenseName, metaURI, mintPrice);
	}

	async mintLicense(teamName: string, projectName: string, licenseName: string, recipient: string): Promise<TransactionAPI> {
		return this.contract.mintLicense(teamName, projectName, licenseName, recipient);
	}

	async setTeamBeneficiary(teamName: string, beneficiary: string): Promise<TransactionAPI> {
		return this.contract.setTeamBeneficiary(teamName, beneficiary);
	}

	async getTeamBeneficiary(teamName: string): Promise<string> {
		return this.contract.getTeamBeneficiary(teamName);
	}
}

export const createClient = async ({ web3Provider }: { web3Provider: providers.Web3Provider }): Promise<Client> => {
	const chainID = await web3Provider.getSigner().getChainId();
	const options = new Contract.EVM_Options(chainID, true);

	const storage = createIPFS();
	const contract = new Contract.EVM(options, web3Provider);

	const client = new Client(contract, storage);
	return client;
};
