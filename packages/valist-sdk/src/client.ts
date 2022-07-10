import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import { ContractTransaction } from '@ethersproject/contracts';
import { IPFS } from 'ipfs-core-types';
import { IPFSHTTPClient } from 'ipfs-http-client';
import { ImportCandidate, ImportCandidateStream } from 'ipfs-core-types/src/utils';
import { AccountMeta, ProjectMeta, ReleaseMeta } from './types';
import { fetchGraphQL, Account, Project, Release } from './graphql';
import { generateID } from './utils';
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

	generateID = generateID
}
