import { ContractAPI } from './index';
import { Contract, PopulatedTransaction } from 'ethers';
import { abi } from './artifacts/Valist.sol/Valist.json';
import { BigNumber } from 'ethers';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { sendMetaTx } from './metatx';

export class EVM implements ContractAPI {
	contract: Contract;
	provider: Web3Provider | JsonRpcProvider;
	metaTx: boolean;

	constructor(address: string, web3Provider: Web3Provider | JsonRpcProvider, metaTx: boolean = true) {
		this.contract = new Contract(address, abi, web3Provider.getSigner());
		this.provider = web3Provider;
		this.metaTx = metaTx;
	}

	async createTeam(teamName: string, metaURI: string, beneficiary: string, members: string[]): Promise<string> {
		const tx = await this.contract.populateTransaction.createTeam(teamName, metaURI, beneficiary, members);
		return sendTx(this.provider, 'createTeam', tx, this.metaTx);
	}

	async createProject(teamName: string, projectName: string, metaURI: string, members: string[]): Promise<string> {
		const tx = await this.contract.populateTransaction.createProject(teamName, projectName, metaURI, members);
		return sendTx(this.provider, 'createProject', tx, this.metaTx);
	}

	async createRelease(teamName: string, projectName: string, releaseName: string, metaURI: string): Promise<string> {
		const tx = await this.contract.populateTransaction.createRelease(teamName, projectName, releaseName, metaURI);
		return sendTx(this.provider, 'createRelease', tx, this.metaTx);
	}

	async addTeamMember(teamName: string, address: string): Promise<string> {
		const tx = await this.contract.populateTransaction.addTeamMember(teamName, address);
		return sendTx(this.provider, 'addTeamMember', tx, this.metaTx);
	}

	async removeTeamMember(teamName: string, address: string): Promise<string> {
		const tx = await this.contract.populateTransaction.removeTeamMember(teamName, address);
		return sendTx(this.provider, 'removeTeamMember', tx, this.metaTx);
	}

	async addProjectMember(teamName: string, projectName: string, address: string): Promise<string> {
		const tx = await this.contract.populateTransaction.addProjectMember(teamName, projectName, address);
		return sendTx(this.provider, 'addProjectMember', tx, this.metaTx);
	}

	async removeProjectMember(teamName: string, projectName: string, address: string): Promise<string> {
		const tx = await this.contract.populateTransaction.removeProjectMember(teamName, projectName, address);
		return sendTx(this.provider, 'removeProjectMember', tx, this.metaTx);
	}

	async setTeamMetaURI(teamName: string, metaURI: string): Promise<string> {
		const tx = await this.contract.populateTransaction.setTeamMetaURI(teamName, metaURI);
		return sendTx(this.provider, 'setTeamMetaURI', tx, this.metaTx);
	}

	async setProjectMetaURI(teamName: string, projectName: string, metaURI: string): Promise<string> {
		const tx = await this.contract.populateTransaction.setProjectMetaURI(teamName, projectName, metaURI);
		return sendTx(this.provider, 'setProjectMetaURI', tx, this.metaTx);
	}

	async setTeamBeneficiary(teamName: string, beneficiary: string): Promise<string> {
		const teamID = await this.contract.getTeamID(teamName);
		const tx = await this.contract.populateTransaction.setTeamBeneficiary(teamID, beneficiary);
		return sendTx(this.provider, 'setTeamBeneficiary', tx, this.metaTx);
	}

	async approveRelease(teamName: string, projectName: string, releaseName: string): Promise<string> {
		const tx = await this.contract.populateTransaction.approveRelease(teamName, projectName, releaseName);
		return sendTx(this.provider, 'approveRelease', tx, this.metaTx);
	}

	async rejectRelease(teamName: string, projectName: string, releaseName: string): Promise<string> {
		const tx = await this.contract.populateTransaction.rejectRelease(teamName, projectName, releaseName);
		return sendTx(this.provider, 'rejectRelease', tx, this.metaTx);
	}

	async getLatestReleaseName(teamName: string, projectName: string): Promise<string> {
		return await this.contract.getLatestRelease(teamName, projectName);
	}

	async getTeamMetaURI(teamName: string): Promise<string> {
		return await this.contract.getTeamMetaURI(teamName);
	}

	async getProjectMetaURI(teamName: string, projectName: string): Promise<string> {
		return await this.contract.getProjectMetaURI(teamName, projectName);
	}

	async getReleaseMetaURI(teamName: string, projectName: string, releaseName: string): Promise<string> {
		return await this.contract.getReleaseMetaURI(teamName, projectName, releaseName);
	}

	async getTeamNames(page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getTeamNames(page, size);
	}

	async getProjectNames(teamName: string, page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getProjectNames(teamName, page, size);
	}

	async getReleaseNames(teamName: string, projectName: string, page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getReleaseNames(teamName, projectName, page, size);
	}

	async getTeamMembers(teamName: string, page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getTeamMembers(teamName, page, size);
	}

	async getTeamBeneficiary(teamName: string): Promise<string> {
		const teamID = await this.contract.getTeamID(teamName);
		return await this.contract.getTeamBeneficiary(teamID);
	}

	async getProjectMembers(teamName: string, projectName: string, page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getProjectMembers(teamName, projectName, page, size);
	}

	async getReleaseApprovers(teamName: string, projectName: string, releaseName: string, page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getReleaseApprovers(teamName, projectName, releaseName, page, size);
	}

	async getReleaseRejectors(teamName: string, projectName: string, releaseName: string, page: BigNumber, size: BigNumber): Promise<string[]> {
		return await this.contract.getReleaseRejectors(teamName, projectName, releaseName, page, size);
	}

	async getTeamID(teamName: string): Promise<BigNumber> {
		return await this.contract.getTeamID(teamName);
	}

	async getProjectID(teamID: BigNumber, projectName: string): Promise<BigNumber> {
		return await this.contract.getProjectID(teamID, projectName);
	}

	async getReleaseID(projectID: BigNumber, releaseName: string): Promise<BigNumber> {
		return await this.contract.getReleaseID(projectID, releaseName);
	}
}

export const deployedAddresses: {[chainID: number]: string} = {
	// Deterministic Ganache
	1337: '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab',
	// Mumbai testnet
	80001: '0x9569bEb0Eba900495cF58028DB094D824d0AE850',
	// Polygon mainnet
	// 137: '',
};

export const sendTx = (
	provider: Web3Provider | JsonRpcProvider,
    functionName: string,
    tx: PopulatedTransaction,
	metaTx: Boolean,
) => {

	if (metaTx) return sendMetaTx(provider, functionName, tx);

	return provider.send('eth_sendTransaction', [tx.from, tx.data]);
}