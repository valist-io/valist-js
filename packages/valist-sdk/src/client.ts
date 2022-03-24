import axios from 'axios';
import { BigNumberish, BigNumber, Contract, PopulatedTransaction, Signer } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { IPFS } from 'ipfs-core-types';
import { ImportCandidate, ImportCandidateStream } from 'ipfs-core-types/src/utils';
import { create } from 'ipfs-http-client';

import { TeamMeta, ProjectMeta, ReleaseMeta, LicenseMeta } from './index';
import { sendMetaTx, sendTx } from './metatx';

import * as valistContract from './contract/Valist.json';
import * as licenseContract from './contract/License.json';

export type Provider = Web3Provider | JsonRpcProvider;

export class Client {
	constructor(
		private valist: Contract,
		private license: Contract,
		private provider: Provider,
		private ipfs: IPFS,
		private gateway: string,
		private metaTx: boolean
	) {}

	async createTeam(teamName: string, team: TeamMeta, beneficiary: string, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(team));
		const tx = await this.valist.populateTransaction.createTeam(teamName, metaURI, beneficiary, members);
		return await this.sendTx('createTeam', tx, this.metaTx);
	}

	async createProject(teamName: string, projectName: string, project: ProjectMeta, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(project));
		const tx = await this.valist.populateTransaction.createProject(teamName, projectName, metaURI, members);
		return await this.sendTx('createProject', tx, this.metaTx);
	}

	async createRelease(teamName: string, projectName: string, releaseName: string, release: ReleaseMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(release));
		const tx = await this.valist.populateTransaction.createRelease(teamName, projectName, releaseName, metaURI);
		return await this.sendTx('createRelease', tx, this.metaTx);
	}

	async createLicense(teamName: string, projectName: string, licenseName: string, license: LicenseMeta, mintPrice: BigNumberish): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(license));
		const tx = await this.license.populateTransaction.createLicense(teamName, projectName, licenseName, metaURI, mintPrice);
		return await this.sendTx('createLicense', tx, this.metaTx);
	}

	async mintLicense(teamName: string, projectName: string, licenseName: string, recipient: string): Promise<TransactionResponse> {
		const value = await this.getLicensePrice(teamName, projectName, licenseName)
		return await this.license.mintLicense(teamName, projectName, licenseName, recipient, { value });
	}

	async addTeamMember(teamName: string, address: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.addTeamMember(teamName, address);
		return await this.sendTx('addTeamMember', tx, this.metaTx);
	}

	async removeTeamMember(teamName: string, address: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.removeTeamMember(teamName, address);
		return await this.sendTx('removeTeamMember', tx, this.metaTx);
	}

	async addProjectMember(teamName: string, projectName: string, address: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.addProjectMember(teamName, projectName, address);
		return await this.sendTx('addProjectMember', tx, this.metaTx);
	}

	async removeProjectMember(teamName: string, projectName: string, address: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.removeProjectMember(teamName, projectName, address);
		return await this.sendTx('removeProjectMember', tx, this.metaTx);
	}

	async setTeamMetaURI(teamName: string, metaURI: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.setTeamMetaURI(teamName, metaURI);
		return await this.sendTx('setTeamMetaURI', tx, this.metaTx);
	}

	async setProjectMetaURI(teamName: string, projectName: string, metaURI: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.setProjectMetaURI(teamName, projectName, metaURI);
		return await this.sendTx('setProjectMetaURI', tx, this.metaTx);
	}

	async setTeamBeneficiary(teamName: string, beneficiary: string): Promise<TransactionResponse> {
		const teamID = await this.valist.getTeamID(teamName);
		const tx = await this.valist.populateTransaction.setTeamBeneficiary(teamID, beneficiary);
		return await this.sendTx('setTeamBeneficiary', tx, this.metaTx);
	}

	async approveRelease(teamName: string, projectName: string, releaseName: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.approveRelease(teamName, projectName, releaseName);
		return await this.sendTx('approveRelease', tx, this.metaTx);
	}

	async rejectRelease(teamName: string, projectName: string, releaseName: string): Promise<TransactionResponse> {
		const tx = await this.valist.populateTransaction.rejectRelease(teamName, projectName, releaseName);
		return await this.sendTx('rejectRelease', tx, this.metaTx);
	}

	async getTeamMeta(teamName: string): Promise<TeamMeta> {
		const metaURI = await this.getTeamMetaURI(teamName);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getProjectMeta(teamName: string, projectName: string): Promise<ProjectMeta> {
		const metaURI = await this.getProjectMetaURI(teamName, projectName);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getReleaseMeta(teamName: string, projectName: string, releaseName: string): Promise<ReleaseMeta> {
		const metaURI = await this.getReleaseMetaURI(teamName, projectName, releaseName);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getLatestReleaseMeta(teamName: string, projectName: string): Promise<ReleaseMeta> {
		const releaseName = await this.getLatestReleaseName(teamName, projectName);
		return await this.getReleaseMeta(teamName, projectName, releaseName);
	}

	async getLicenseMeta(teamName: string, projectName: string, licenseName: string): Promise<LicenseMeta> {
		const metaURI = await this.getLicenseMetaURI(teamName, projectName, licenseName);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getLatestReleaseName(teamName: string, projectName: string): Promise<string> {
		return await this.valist.getLatestRelease(teamName, projectName);
	}

	async getTeamMetaURI(teamName: string): Promise<string> {
		return await this.valist.getTeamMetaURI(teamName);
	}

	async getProjectMetaURI(teamName: string, projectName: string): Promise<string> {
		return await this.valist.getProjectMetaURI(teamName, projectName);
	}

	async getReleaseMetaURI(teamName: string, projectName: string, releaseName: string): Promise<string> {
		return await this.valist.getReleaseMetaURI(teamName, projectName, releaseName);
	}

	async getTeamNames(page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getTeamNames(page, size);
	}

	async getProjectNames(teamName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getProjectNames(teamName, page, size);
	}

	async getReleaseNames(teamName: string, projectName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getReleaseNames(teamName, projectName, page, size);
	}

	async getTeamMembers(teamName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getTeamMembers(teamName, page, size);
	}

	async getTeamBeneficiary(teamName: string): Promise<string> {
		const teamID = await this.valist.getTeamID(teamName);
		return await this.valist.getTeamBeneficiary(teamID);
	}

	async getProjectMembers(teamName: string, projectName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getProjectMembers(teamName, projectName, page, size);
	}

	async getReleaseApprovers(teamName: string, projectName: string, releaseName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getReleaseApprovers(teamName, projectName, releaseName, page, size);
	}

	async getReleaseRejectors(teamName: string, projectName: string, releaseName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.valist.getReleaseRejectors(teamName, projectName, releaseName, page, size);
	}

	async getTeamID(teamName: string): Promise<BigNumber> {
		return await this.valist.getTeamID(teamName);
	}

	async getProjectID(teamID: BigNumberish, projectName: string): Promise<BigNumber> {
		return await this.valist.getProjectID(teamID, projectName);
	}

	async getReleaseID(projectID: BigNumberish, releaseName: string): Promise<BigNumber> {
		return await this.valist.getReleaseID(projectID, releaseName);
	}

	async getLicenseBalance(address: string, licenseID: BigNumberish): Promise<BigNumber> {
		return await this.license.balanceOf(address, licenseID);
	}

	async getLicensePrice(teamName: string, projectName: string, licenseName: string): Promise<BigNumber> {
		const teamID = await this.getTeamID(teamName);
		const projectID = await this.getProjectID(teamID, projectName);
		const licenseID = await this.getLicenseID(projectID, licenseName);
		return await this.license.priceByID(licenseID);
	}

	async getLicenseMetaURI(teamName: string, projectName: string, licenseName: string): Promise<string> {
		return await this.license.getLicenseMetaURI(teamName, projectName, licenseName);
	}

	async getLicenseNames(teamName: string, projectName: string, page: BigNumberish, size: BigNumberish): Promise<string[]> {
		return await this.license.getNamesByProjectID(teamName, projectName, page, size);
	}

	async getLicenseID(projectID: BigNumberish, licenseName: string): Promise<BigNumber> {
		return await this.license.getLicenseID(projectID, licenseName);
	}

	async writeJSON(data: string): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `${this.gateway}/ipfs/${cid.toString()}`;
	}

	async writeFile(data: ImportCandidate): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `${this.gateway}/ipfs/${cid.toString()}`;
	}

	async writeFolder(data: ImportCandidateStream): Promise<string> {
		const opts = { wrapWithDirectory: true };
		const cids: string[] = [];
		for await (const res of this.ipfs.addAll(data, opts)) {
			cids.push(res.cid.toString());
		}
		return `${this.gateway}/ipfs/${cids[cids.length - 1]}`;
	}

	private async sendTx(functionName: string, params: PopulatedTransaction, metaTx: boolean): Promise<TransactionResponse> {
		const hash = metaTx
			? await sendMetaTx(this.provider, functionName, params)
			: await sendTx(this.provider, functionName, params);

		let tx: TransactionResponse;
		do { tx = await this.provider.getTransaction(hash); } while (tx == null);

		return tx;
	}
}

export const valistAddresses: {[chainID: number]: string} = {
	// Deterministic Ganache
	1337: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
	// Mumbai testnet
	80001: '0x9569bEb0Eba900495cF58028DB094D824d0AE850',
	// Polygon mainnet
	137: '0xc70A069eC7F887a7497a4bdC7bE666C1e18c8DC3',
};

export const licenseAddresses: {[chainID: number]: string} = {
	// Deterministic Ganache
	1337: '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24',
	// Mumbai testnet
	80001: '0x597bfcE7F9363b6eBc229f2023F9EcD716C88120',
	// Polygon mainnet
	137: '0xb85ed41d49Eba25aE6186921Ea63b6055903e810',
};

export class Options {
	public chainID = 137;
	public metaTx = true;
	public ipfsHost = 'https://gateway.valist.io';
	public ipfsGateway = 'https://gateway.valist.io';
}

export function createClient(provider: Provider, signer?: Signer, options: Options = new Options()): Client {
	const valistAddress = valistAddresses[options.chainID];
	const licenseAddress = licenseAddresses[options.chainID];

	const valist = new Contract(valistAddress, valistContract.abi, signer || provider);
	const license = new Contract(licenseAddress, licenseContract.abi, signer || provider);
	const ipfs = create({url: options.ipfsHost});

	return new Client(
		valist,
		license,
		provider,
		ipfs,
		options.ipfsGateway,
		options.metaTx
	);
}