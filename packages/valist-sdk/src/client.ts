import axios from 'axios';
import { BigNumber, ethers, PopulatedTransaction } from 'ethers';
import { ContractTransaction } from '@ethersproject/contracts';
import { getFilesFromPath } from './utils';

import { AccountMeta, PlatformsMeta, ProjectMeta, ReleaseMeta, SupportedPlatform, FileObject, ReleaseConfig } from './types';
import { fetchGraphQL, Account, Project, Release } from './graphql';
import { generateID, getAccountID, getProjectID, getReleaseID } from './utils';
import * as queries from './graphql/queries';
import { IPFSHTTPClient } from 'ipfs-http-client';
import { sendMetaTx, sendTx } from './metatx';
import { ImportCandidate } from 'ipfs-core-types/src/utils';
import path from 'path';

// minimal ABI for interacting with erc20 tokens
const erc20ABI = [
	'function approve(address spender, uint256 amount) returns (bool)'
];

export default class Client {
	constructor(
		private registry: ethers.Contract,
		private license: ethers.Contract,
		private ipfs: IPFSHTTPClient,
		private ipfsGateway: string,
		private subgraphUrl: string,
		private signer?: ethers.Signer,
		private metaTx: boolean = true,
	) { }

	async createAccount(name: string, meta: AccountMeta, members: string[]): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(meta);
		const unsigned = await this.registry.populateTransaction.createAccount(name, metaURI, members);
		return await this.sendTx(unsigned);
	}

	async createProject(accountID: ethers.BigNumberish, name: string, meta: ProjectMeta, members: string[]): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(meta);
		const unsigned = await this.registry.populateTransaction.createProject(accountID, name, metaURI, members);
		return await this.sendTx(unsigned);
	}

	async uploadRelease(config: ReleaseConfig): Promise<ReleaseMeta> {
		const release = new ReleaseMeta();

		release.name = config.release;
		release.description = config.description || '';

		release.path = `${config.account}/${config.project}/${config.release}`;

		release.platforms = new PlatformsMeta();

		let filesObject: Record<string, (FileObject)[]> = {};
		const platforms = Object.keys(config.platforms);

		for (let i = 0; i < platforms.length; i++) {
			if (config.platforms[platforms[i] as SupportedPlatform]) {
				filesObject[platforms[i]] = await getFilesFromPath(config.platforms[platforms[i] as SupportedPlatform]);
			}
		}

		const { web, ...nonWebFiles } = filesObject;
		let webCID, nativeCID = '';

		const webIC: ImportCandidate[] = web.map(file => ({
			path: file.name,
			content: file.stream(),
		}));

		const nonWebIC: ImportCandidate[] = Object.entries(nonWebFiles)
			.flatMap(([platform, files]) => files
				.map(file => ({
					path: path.join(platform, path.basename(file.name)),
					content: file.stream(),
				}),
			));

		if (nonWebIC.length > 0) {
			nativeCID = await this.writeFolder(nonWebIC, true);

			Object.keys(filesObject).forEach((platform) => {
				if (release.platforms && filesObject[platform] && filesObject[platform].length !== 0) {
					const fileName = path.basename((filesObject[platform][0].name)); // @TODO make this work with folders
					release.platforms[platform as SupportedPlatform] = {
						external_url: path.join(nativeCID, platform, fileName),
						name: fileName,
					};
				}
			});
		}

		if (webIC.length > 0) {
			webCID = await this.writeFolder(webIC, false);

			release.platforms.web = {
				external_url: webCID,
				name: 'web',
			};
		};

		release.external_url = webCID || nativeCID;

		// upload release image
		if (config.image) {
			const imageFile = await getFilesFromPath(config.image);
			release.image = await this.writeFile(imageFile[0]);
		}

		return release;
	}

	async createRelease(projectID: ethers.BigNumberish, name: string, meta: ReleaseMeta): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(meta);
		const unsigned = await this.registry.populateTransaction.createRelease(projectID, name, metaURI);
		return await this.sendTx(unsigned);
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
		const metaURI = await this.writeJSON(meta);
		const unsigned = await this.registry.populateTransaction.setAccountMetaURI(accountID, metaURI);
		return await this.sendTx(unsigned);
	}

	async setProjectMeta(projectID: ethers.BigNumberish, meta: ProjectMeta): Promise<ContractTransaction> {
		const metaURI = await this.writeJSON(meta);
		const unsigned = await this.registry.populateTransaction.setProjectMetaURI(projectID, metaURI);
		return await this.sendTx(unsigned);
	}

	async addAccountMember(accountID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		const unsigned = await this.registry.populateTransaction.addAccountMember(accountID, address);
		return await this.sendTx(unsigned);
	}

	async removeAccountMember(accountID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		const unsigned = await this.registry.populateTransaction.removeAccountMember(accountID, address);
		return await this.sendTx(unsigned);
	}

	async addProjectMember(projectID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		const unsigned = await this.registry.populateTransaction.addProjectMember(projectID, address);
		return await this.sendTx(unsigned);
	}

	async removeProjectMember(projectID: ethers.BigNumberish, address: string): Promise<ContractTransaction> {
		const unsigned = await this.registry.populateTransaction.removeProjectMember(projectID, address);
		return await this.sendTx(unsigned);
	}

	async approveRelease(releaseID: ethers.BigNumberish): Promise<ContractTransaction> {
		const unsigned = await this.registry.populateTransaction.approveRelease(releaseID);
		return await this.sendTx(unsigned);
	}

	async revokeRelease(releaseID: ethers.BigNumberish): Promise<ContractTransaction> {
		const unsigned = await this.registry.populateTransaction.approveRelease(releaseID);
		return await this.sendTx(unsigned);
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

	async getProductBalance(address: string, projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		return await this.license.balanceOf(address, projectID);
	}

	async getProductBalanceBatch(addresses: string[], projectIDs: ethers.BigNumberish[]): Promise<ethers.BigNumber[]> {
		return await this.license.balanceOfBatch(addresses, projectIDs);
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

	getFileBaseName(filePath: string) {
		return filePath.split('/').pop() || filePath;
	}

	isBrowserFile(file: File | FileObject): file is File {
		return (file as File).lastModified !== undefined;
	};

	async writeJSON(data: Object): Promise<string> {
		let buffer: Blob | Buffer;
		let string = JSON.stringify(data);

		if (typeof window === 'undefined') {
			buffer = Buffer.from(JSON.stringify(data));
		} else {
			buffer = new Blob([string], { type: 'application/json' });
		}

		const res = await this.ipfs.add(buffer, { cidVersion: 1 });

		return `${this.ipfsGateway}/ipfs/${res.cid.toString()}`;
	}

	async writeFile(file: File | FileObject, wrapWithDirectory = false, onProgress?: (percent: number) => void) {
		if (typeof file === 'undefined') throw new Error("file === undefined, must pin at least one file");

		let fileData, fileSize: number;
		const baseFileName = this.getFileBaseName(file.name);
		const path = wrapWithDirectory ? `/${baseFileName}/${baseFileName}` : baseFileName;

		if (this.isBrowserFile(file)) {
			fileData = {
				content: file,
				path: file.name,
			};
			fileSize = file.size;
		} else {
			const fileStream = file.stream();
			fileData = { content: fileStream, path };
			fileSize = require('fs').statSync(fileStream.path).size;
		}

		const res = await this.ipfs.add(fileData, {
			wrapWithDirectory,
			cidVersion: 1,
		});

		return `${this.ipfsGateway}/ipfs/${res.cid.toString()}`;
	}

	async writeFolder(files: ImportCandidate[], wrapWithDirectory = false, onProgress?: (percent: number) => void) {
		if (files.length == 0) throw new Error("files.length == 0, must pin at least one file");

		const cids: string[] = [];
		for await (const res of this.ipfs.addAll(files, {
			cidVersion: 1,
			wrapWithDirectory,
		})) {
			cids.push(res.cid.toString());
		}

		return `${this.ipfsGateway}/ipfs/${cids[cids.length - 1]}`;
	}

	async sendTx(unsigned: PopulatedTransaction): Promise<ethers.providers.TransactionResponse> {
		if (!this.signer) throw new Error('valist client is read-only');

		const txReq = {
			from: await this.signer.getAddress(),
			...unsigned,
		};

		let hash = this.metaTx
			? await sendMetaTx(this.signer, txReq)
			: await sendTx(this.signer, txReq);

		let tx;

		do {
			tx = await this.registry.provider.getTransaction(hash);
		} while (tx == null);

		return tx;
	}

	generateID = generateID;

	getAccountID = getAccountID;

	getProjectID = getProjectID;

	getReleaseID = getReleaseID;
}
