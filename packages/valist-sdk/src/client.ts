import axios from 'axios';
import { RelayProvider } from '@opengsn/provider';
import { BigNumberish, BigNumber, Contract, PopulatedTransaction, Signer } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';
import { IPFS } from 'ipfs-core-types';
import { ImportCandidate, ImportCandidateStream } from 'ipfs-core-types/src/utils';
import { create } from 'ipfs-http-client';
import { AccountMeta, ProjectMeta, ReleaseMeta } from './index';

import * as registryContract from './contract/Registry.json';
import * as licenseContract from './contract/License.json';

export type Provider = Web3Provider | JsonRpcProvider;

export class Options {
	public chainID = 137;
	public ipfsHost = 'https://pin.valist.io';
	public ipfsGateway = 'https://gateway.valist.io';
}

export async function createClient(web3: any, options: Options = new Options()): Promise<Client> {
	const registryAddress = registryAddresses[options.chainID];
	const licenseAddress = licenseAddresses[options.chainID];
	const paymasterAddress = paymasterAddresses[options.chainID];
	
	const relayProvider = RelayProvider.newProvider({ 
		provider: web3, 
		config: { paymasterAddress }
	});
	await relayProvider.init();

	// @ts-ignore
	const provider = new Web3Provider(relayProvider);
	const registry = new Contract(registryAddress, registryContract.abi, provider);
	const license = new Contract(licenseAddress, licenseContract.abi, provider);
	const ipfs = create({ url: options.ipfsHost });

	return new Client(registry, license, ipfs, options.ipfsGateway);
}

export class Client {
	constructor(
		private registry: Contract,
		private license: Contract,
		private ipfs: IPFS,
		private ipfsGateway: string
	) {}

	async createAccount(name: string, meta: AccountMeta, beneficiary: string, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createAccount(name, metaURI, beneficiary, members);
	}

	async createProject(accountID: BigNumberish, name: string, meta: ProjectMeta, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createProject(accountID, name, metaURI, members);
	}

	async createRelease(projectID: BigNumberish, name: string, meta: ReleaseMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createRelease(projectID, name, metaURI);
	}

	async addAccountMember(accountID: BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.addAccountMember(accountID, address);
	}

	async removeAccountMember(accountID: BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.removeAccountMember(accountID, address);
	}

	async addProjectMember(projectID: BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.addProjectMember(projectID, address);
	}

	async removeProjectMember(projectID: BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.removeProjectMember(projectID, address);
	}

	async setAccountMeta(accountID: BigNumberish, meta: AccountMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.setAccountMetaURI(accountID, metaURI);
	}

	async setProjectMeta(projectID: BigNumberish, meta: ProjectMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.setProjectMetaURI(projectID, metaURI);
	}

	async setBeneficiary(accountID: BigNumberish, beneficiary: string): Promise<TransactionResponse> {
		return await this.registry.setBeneficiary(accountID, beneficiary);
	}

	async approveRelease(releaseID: BigNumberish): Promise<TransactionResponse> {
		return await this.registry.approveRelease(releaseID);
	}

	async revokeRelease(releaseID: BigNumberish): Promise<TransactionResponse> {
		return await this.registry.approveRelease(releaseID);
	}

	async getAccountMeta(accountID: BigNumberish): Promise<AccountMeta> {
		const metaURI = await this.registry.metaByID(accountID);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getProjectMeta(projectID: BigNumberish): Promise<ProjectMeta> {
		const metaURI = await this.registry.metaByID(projectID);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getReleaseMeta(releaseID: BigNumberish): Promise<ReleaseMeta> {
		const metaURI = await this.registry.metaByID(releaseID);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getBeneficiary(accountID: BigNumberish): Promise<string> {
		return await this.registry.getBeneficiary(accountID);
	}

	async getAccountMembers(accountID: BigNumberish): Promise<string[]> {
		return await this.registry.getAccountMembers(accountID);
	}

	async getProjectMembers(projectID: BigNumberish): Promise<string[]> {
		return await this.registry.getProjectMembers(projectID);
	}

	async getReleaseSigners(releaseID: BigNumberish): Promise<string[]> {
		return await this.registry.getReleaseSigners(releaseID);
	}

	async getAccountID(chainID: BigNumberish, name: string): Promise<BigNumber> {
		return await this.registry.generateID(chainID, name); // TODO generate offline
	}

	async getProjectID(accountID: BigNumberish, name: string): Promise<BigNumber> {
		return await this.registry.generateID(accountID, name); // TODO generate offline
	}

	async getReleaseID(projectID: BigNumberish, name: string): Promise<BigNumber> {
		return await this.registry.generateID(projectID, name); // TODO generate offline
	}

	async writeJSON(data: string): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `${this.ipfsGateway}/ipfs/${cid.toString()}`;
	}

	async writeFile(data: ImportCandidate): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `${this.ipfsGateway}/ipfs/${cid.toString()}`;
	}

	async writeFolder(data: ImportCandidateStream): Promise<string> {
		const opts = { wrapWithDirectory: true };
		const cids: string[] = [];
		for await (const res of this.ipfs.addAll(data, opts)) {
			cids.push(res.cid.toString());
		}
		return `${this.ipfsGateway}/ipfs/${cids[cids.length - 1]}`;
	}
}

export const paymasterAddresses: {[chainID: number]: string} = {
	// Deterministic Ganache
	1337: 'TODO',
	// Mumbai testnet
	80001: 'TODO',
	// Polygon mainnet
	137: 'TODO',
};

export const registryAddresses: {[chainID: number]: string} = {
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
