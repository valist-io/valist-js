import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { ContractTransaction } from '@ethersproject/contracts';
import { IPFS } from 'ipfs-core-types';
import { IPFSHTTPClient } from 'ipfs-http-client';
import { MemoryBlockStore } from 'ipfs-car/blockstore/memory';
import { packToBlob } from 'ipfs-car/pack/blob'
import { ImportCandidate, ImportCandidateStream } from 'ipfs-core-types/src/utils';
import { FileObject } from 'files-from-path';
import { toImportCandidate } from './utils';

import { AccountMeta, ProjectMeta, ReleaseMeta } from './types';
import { fetchGraphQL, Account, Project, Release } from './graphql';
import { generateID, getAccountID, getProjectID, getReleaseID } from './utils';
import * as queries from './graphql/queries';


// minimal ABI for interacting with erc20 tokens
const erc20ABI = [
	'function approve(address spender, uint256 amount) returns (bool)'
];

export default class Client {
	constructor(
		private registry: ethers.Contract,
		private license: ethers.Contract,
		private ipfs: IPFS | IPFSHTTPClient,
		private ipfsGateway: string,
		private subgraphUrl: string
	) { }

	async createAccount(name: string, meta: AccountMeta, members: string[]): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createAccount(name, metaURI, members);
	}

	async createProject(accountID: ethers.BigNumberish, name: string, meta: ProjectMeta, members: string[]): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createProject(accountID, name, metaURI, members);
	}

	async createRelease(projectID: ethers.BigNumberish, name: string, meta: ReleaseMeta): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createRelease(projectID, name, metaURI);
	}

	async accountExists(accountID: ethers.BigNumberish): Promise<boolean> {
		const metaURI = await this.registry.metaByID(accountID);
		return metaURI !== "";
	}

	async projectExists(projectID: ethers.BigNumberish): Promise<boolean> {
		const metaURI = await this.registry.metaByID(projectID);
		return metaURI !== "";
	}

	async releaseExists(releaseID: ethers.BigNumberish): Promise<boolean> {
		const metaURI = await this.registry.metaByID(releaseID);
		return metaURI !== "";
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

	async setAccountMeta(accountID: ethers.BigNumberish, meta: AccountMeta): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.setAccountMetaURI(accountID, metaURI);
	}

	async setProjectMeta(projectID: ethers.BigNumberish, meta: ProjectMeta): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.setProjectMetaURI(projectID, metaURI);
	}

	async addAccountMember(accountID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		return await this.registry.addAccountMember(accountID, address);
	}

	async removeAccountMember(accountID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		return await this.registry.removeAccountMember(accountID, address);
	}

	async addProjectMember(projectID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		return await this.registry.addProjectMember(projectID, address);
	}

	async removeProjectMember(projectID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		return await this.registry.removeProjectMember(projectID, address);
	}

	async approveRelease(releaseID: ethers.BigNumberish): Promise<ContractTransaction> {
		return await this.registry.approveRelease(releaseID);
	}

	async revokeRelease(releaseID: ethers.BigNumberish): Promise<ContractTransaction> {
		return await this.registry.approveRelease(releaseID);
	}

	async setProductLimit(projectID: ethers.BigNumberish, limit: ethers.BigNumberish): Promise<ContractTransaction> {
		return await this.license.setLimit(projectID, limit);
	}

	async setProductRoyalty(projectID: ethers.BigNumberish, recipient: string, amount: ethers.BigNumberish): Promise<ContractTransaction> {
		return await this.license.setRoyalty(projectID, recipient, amount);
	}

	async setProductPrice(projectID: ethers.BigNumberish, price: ethers.BigNumberish): Promise<ContractTransaction> {
		const setPrice = this.license['setPrice(uint256,uint256)'];
		return await setPrice(projectID, price);
	}

	async setProductTokenPrice(token: string, projectID: ethers.BigNumberish, price: ethers.BigNumberish): Promise<ContractTransaction> {
		const setPrice = this.license['setPrice(address,uint256,uint256)'];
		return await setPrice(token, projectID, price);
	}

	async purchaseProduct(projectID: ethers.BigNumberish, recipient: string): Promise<ContractTransaction> {
		const price = await this.getProductPrice(projectID);
		const purchase = this.license['purchase(uint256,address)'];
		return await purchase(projectID, recipient, { value: price });
	}

	async purchaseProductToken(token: string, projectID: ethers.BigNumberish, recipient: string): Promise<ContractTransaction> {
		const erc20 = new ethers.Contract(token, erc20ABI, this.license.signer);
		const price = await this.getProductTokenPrice(token, projectID);
		// approve the transfer
		const approveTx = await erc20.approve(this.license.address, price);
		await approveTx.wait();
		// purchase the product
		const purchase = this.license['purchase(address,uint256,address)'];
		return await purchase(token, projectID, recipient);
	}

	async withdrawProductBalance(projectID: ethers.BigNumberish, recipient: string): Promise<ContractTransaction> {
		const withdraw = this.license['withdraw(uint256,address)'];
		return await withdraw(projectID, recipient);
	}

	async withdrawProductTokenBalance(token: string, projectID: ethers.BigNumberish, recipient: string): Promise<ContractTransaction> {
		const withdraw = this.license['withdraw(address,uint256,address)'];
		return await withdraw(token, projectID, recipient);
	}

	async getProductPrice(projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		const getPrice = this.license['getPrice(uint256)'];
		return await getPrice(projectID);
	}

	async getProductBalance(address: string, projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		const balanceOf = this.license['balanceOf(address,uint256)'];
		return await balanceOf(address, projectID);
	}

	async getProductTokenPrice(token: string, projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		const getPrice = this.license['getPrice(address,uint256)'];
		return await getPrice(token, projectID);
	}

	async getProductLimit(projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.license.getLimit(projectID);
	}

	async getProductRoyaltyInfo(projectID: ethers.BigNumberish, price: ethers.BigNumberish): Promise<[string, BigNumber]> {
		return await this.license.royaltyInfo(projectID, price);
	}

	async getProductSupply(projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.license.getSupply(projectID);
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

	async getLatestReleaseID(projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.registry.getLatestReleaseID(projectID);
	}

	async getPreviousReleaseID(releaseID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.registry.getPreviousReleaseID(releaseID);
	}

	async getProjectAccountID(projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.registry.getProjectAccountID(projectID);
	}

	async getReleaseProjectID(releaseID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.registry.getReleaseProjectID(releaseID);
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

	async listAccounts(): Promise<Account> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.ACCOUNT_QUERY
		});
		return data.accounts;
	}

	async listProjects(): Promise<Project> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.PROJECT_QUERY
		});
		return data.projects;	
	}

	async listReleases(): Promise<Release> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.RELEASE_QUERY
		});
		return data.releases;
	}

	async listAccountProjects(accountID: ethers.BigNumberish): Promise<Project[]> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.ACCOUNT_PROJECT_QUERY,
			variables: { accountID: accountID }
		});
		return data.account ? data.account.projects : [];
	}

	async listProjectReleases(projectID: ethers.BigNumberish): Promise<Release[]> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.PROJECT_RELEASE_QUERY,
			variables: { projectID }
		});
		return data.project ? data.project.releases : [];
	}

	async listUserAccounts(address: string): Promise<Account[]> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.USER_ACCOUNTS_QUERY,
			variables: { address }
		});
		return data.user ? data.user.accounts : [];
	}

	async listUserProjects(address: string): Promise<Project[]> {
		const { data } = await fetchGraphQL(this.subgraphUrl, {
			query: queries.USER_PROJECTS_QUERY,
			variables: { address }
		});
		return data.user ? data.user.projects : [];
	}

	async writeJSON(data: string): Promise<string> {
		let buffer: Buffer | Blob;
		if (typeof window === 'undefined') {
			buffer = Buffer.from(data);

		} else {
			buffer = new Blob([data], { type: 'application/json' });
		}

		const { root: cid, car } = await packToBlob({
			input: buffer,
			blockstore: new MemoryBlockStore(),
			wrapWithDirectory: false,
		});

		const auth = await axios.post(`https://pin-new.valist.io`);
		const upload = await axios.put(auth.data, await car.arrayBuffer(), {
			maxBodyLength: Infinity,
			headers: { 'x-amz-meta-import': 'car' },
		});

		if (upload.headers['x-amz-meta-cid'] !== cid.toString()) {
			throw new Error(`Generated CID ${cid} did not match response ${upload.headers['x-amz-meta-cid']}`);
		}

		return `${this.ipfsGateway}/ipfs/${cid.toString()}`;
	}

	async writeFile(file: ImportCandidate | ImportCandidateStream | FileObject, wrapWithDirectory = false): Promise<string> {
		const { root: cid, car } = await packToBlob({
			input: typeof window === 'undefined'
				? toImportCandidate(file as File)
				: [({ path: (file as any).path, content: file })] as ImportCandidate,
			blockstore: new MemoryBlockStore(), // @TODO make this fs-based in node.js
			wrapWithDirectory,
		});

		const auth = await axios.post(`https://pin-new.valist.io`);
		const upload = await axios.put(auth.data, await car.arrayBuffer(), {
			maxBodyLength: Infinity,
			headers: { 'x-amz-meta-import': 'car' },
		});

		if (upload.headers['x-amz-meta-cid'] !== cid.toString()) {
			throw new Error(`Generated CID ${cid} did not match response ${upload.headers['x-amz-meta-cid']}`);
		}

		return `${this.ipfsGateway}/ipfs/${cid.toString()}`;
	}

	async writeFolder(files: ImportCandidate | ImportCandidateStream | FileObject[], wrapWithDirectory = false): Promise<string> {

		let toWrap = wrapWithDirectory;
		const toPush = typeof window === 'undefined'
			? (files as File[]).map(toImportCandidate)
			: (files as ImportCandidate[]).map((file: any) => { 
				if (!file.path || file.path[0] !== '/') toWrap = true;
				return ({ path: file.path || file.name, content: file });
		});

		const { root: cid, car } = await packToBlob({
			input: toPush,
			blockstore: new MemoryBlockStore(), // @TODO make this fs-based in node.js
			wrapWithDirectory: toWrap,
		});

		const auth = await axios.post(`https://pin-new.valist.io`);
		const upload = await axios.put(auth.data, await car.arrayBuffer(), {
			maxBodyLength: Infinity,
			headers: { 'x-amz-meta-import': 'car' },
		});

		if (upload.headers['x-amz-meta-cid'] !== cid.toString()) {
			throw new Error(`Generated CID ${cid} did not match response ${upload.headers['x-amz-meta-cid']}`);
		}

		return `${this.ipfsGateway}/ipfs/${cid.toString()}`;
	}

	generateID = generateID

	getAccountID = getAccountID;

	getProjectID = getProjectID;

	getReleaseID = getReleaseID;
}
