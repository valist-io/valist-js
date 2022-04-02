import axios from 'axios';
import { RelayProvider } from '@opengsn/provider';
import { ethers } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { IPFS } from 'ipfs-core-types';
import { ImportCandidate, ImportCandidateStream } from 'ipfs-core-types/src/utils';
import { create } from 'ipfs-http-client';
import { AccountMeta, ProjectMeta, ReleaseMeta } from './index';

import * as registryContract from './contract/Registry.json';
import * as licenseContract from './contract/License.json';

export class Client {
	constructor(
		private registry: ethers.Contract,
		private license: ethers.Contract,
		private ipfs: IPFS,
		private ipfsGateway: string
	) {}

	async createAccount(name: string, meta: AccountMeta, beneficiary: string, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createAccount(name, metaURI, beneficiary, members);
	}

	async createProject(accountID: ethers.BigNumberish, name: string, meta: ProjectMeta, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createProject(accountID, name, metaURI, members);
	}

	async createRelease(projectID: ethers.BigNumberish, name: string, meta: ReleaseMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createRelease(projectID, name, metaURI);
	}

	async getAccountMeta(accountID: ethers.BigNumberish): Promise<AccountMeta> {
		const metaURI = await this.registry.metaByID(accountID);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getProjectMeta(projectID: ethers.BigNumberish): Promise<ProjectMeta> {
		const metaURI = await this.registry.metaByID(projectID);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async getReleaseMeta(releaseID: ethers.BigNumberish): Promise<ReleaseMeta> {
		const metaURI = await this.registry.metaByID(releaseID);
		const { data } = await axios.get(metaURI);
		return data;
	}

	async setAccountMeta(accountID: ethers.BigNumberish, meta: AccountMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.setAccountMetaURI(accountID, metaURI);
	}

	async setProjectMeta(projectID: ethers.BigNumberish, meta: ProjectMeta): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.setProjectMetaURI(projectID, metaURI);
	}

	async addAccountMember(accountID: ethers.BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.addAccountMember(accountID, address);
	}

	async removeAccountMember(accountID: ethers.BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.removeAccountMember(accountID, address);
	}

	async addProjectMember(projectID: ethers.BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.addProjectMember(projectID, address);
	}

	async removeProjectMember(projectID: ethers.BigNumberish, address: string): Promise<TransactionResponse> {
		return await this.registry.removeProjectMember(projectID, address);
	}

	async setBeneficiary(accountID: ethers.BigNumberish, beneficiary: string): Promise<TransactionResponse> {
		return await this.registry.setBeneficiary(accountID, beneficiary);
	}

	async approveRelease(releaseID: ethers.BigNumberish): Promise<TransactionResponse> {
		return await this.registry.approveRelease(releaseID);
	}

	async revokeRelease(releaseID: ethers.BigNumberish): Promise<TransactionResponse> {
		return await this.registry.approveRelease(releaseID);
	}

	async getBeneficiary(accountID: ethers.BigNumberish): Promise<string> {
		return await this.registry.getBeneficiary(accountID);
	}

	async getAccountMembers(accountID: ethers.BigNumberish): Promise<string[]> {
		return await this.registry.getAccountMembers(accountID);
	}

	async getProjectMembers(projectID: ethers.BigNumberish): Promise<string[]> {
		return await this.registry.getProjectMembers(projectID);
	}

	async getReleaseSigners(releaseID: ethers.BigNumberish): Promise<string[]> {
		return await this.registry.getReleaseSigners(releaseID);
	}

	async isAccountMember(accountID: ethers.BigNumberish, address: string): Promise<boolean> {
		return await this.registry.isAccountMember(accountID, address);
	}

	async isProjectMember(projectID: ethers.BigNumberish, address: string): Promise<boolean> {
		return await this.registry.isProjectMember(projectID, address);
	}

	async isReleaseSigner(releaseID: ethers.BigNumberish, address: string): Promise<boolean> {
		return await this.registry.isReleaseSigner(releaseID, address);
	}

	getAccountID(chainID: ethers.BigNumberish, name: string): ethers.BigNumberish {
		const nameBytes = ethers.utils.toUtf8Bytes(name);
		const nameHash = ethers.utils.keccak256(nameBytes);
		return ethers.utils.solidityKeccak256([ "uint256", "bytes32" ], [ chainID, nameHash ]);
	}

	getProjectID(accountID: ethers.BigNumberish, name: string): ethers.BigNumberish {
		const nameBytes = ethers.utils.toUtf8Bytes(name);
		const nameHash = ethers.utils.keccak256(nameBytes);
		return ethers.utils.solidityKeccak256([ "uint256", "bytes32" ], [ accountID, nameHash ]);
	}

	getReleaseID(projectID: ethers.BigNumberish, name: string): ethers.BigNumberish {
		const nameBytes = ethers.utils.toUtf8Bytes(name);
		const nameHash = ethers.utils.keccak256(nameBytes);
		return ethers.utils.solidityKeccak256([ "uint256", "bytes32" ], [ projectID, nameHash ]);
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
	const provider = new ethers.providers.Web3Provider(relayProvider);
	const registry = new ethers.Contract(registryAddress, registryContract.abi, provider);
	const license = new ethers.Contract(licenseAddress, licenseContract.abi, provider);
	const ipfs = create({ url: options.ipfsHost });

	return new Client(registry, license, ipfs, options.ipfsGateway);
}
