import axios from 'axios';
import { RelayProvider, GSNConfig } from '@opengsn/provider';
import { ethers } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { IPFS } from 'ipfs-core-types';
import { ImportCandidate, ImportCandidateStream } from 'ipfs-core-types/src/utils';
import { create } from 'ipfs-http-client';
import { AccountMeta, ProjectMeta, ReleaseMeta } from './index';

import * as registryContract from './contract/Registry.json';
import * as licenseContract from './contract/License.json';

// minimal ABI for interacting with erc20 tokens
const erc20ABI = [
	'function approve(address spender, uint256 amount) returns (bool)'
];

export class Client {
	constructor(
		private registry: ethers.Contract,
		private license: ethers.Contract,
		private ipfs: IPFS,
		private ipfsGateway: string
	) {}

	async createAccount(name: string, meta: AccountMeta, members: string[]): Promise<TransactionResponse> {
		const metaURI = await this.writeJSON(JSON.stringify(meta));
		return await this.registry.createAccount(name, metaURI, members);
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

	async approveRelease(releaseID: ethers.BigNumberish): Promise<TransactionResponse> {
		return await this.registry.approveRelease(releaseID);
	}

	async revokeRelease(releaseID: ethers.BigNumberish): Promise<TransactionResponse> {
		return await this.registry.approveRelease(releaseID);
	}

	async setProductPrice(projectID: ethers.BigNumberish, price: ethers.BigNumberish): Promise<TransactionResponse> {
		const setPrice = this.license['setPrice(uint256,uint256)'];
		return await setPrice(projectID, price);
	}

	async setProductTokenPrice(token: string, projectID: ethers.BigNumberish, price: ethers.BigNumberish): Promise<TransactionResponse> {
		const setPrice = this.license['setPrice(address,uint256,uint256)'];
		return await setPrice(token, projectID, price);
	}

	async purchaseProduct(projectID: ethers.BigNumberish, recipient: string): Promise<TransactionResponse> {
		const price = await this.getProductPrice(projectID);
		const purchase = this.license['purchase(uint256,address)'];
		return await purchase(projectID, recipient, { value: price });
	}

	async purchaseProductToken(token: string, projectID: ethers.BigNumberish, recipient: string): Promise<TransactionResponse> {
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

	async getProductTokenPrice(token: string, projectID: ethers.BigNumberish): Promise<ethers.BigNumber> {
		const getPrice = this.license['getPrice(address,uint256)'];
		return await getPrice(token, projectID);
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

/**
 * Generate account, project, and release IDs.
 * 
 * @param parentID ID of the parent account or release. Use chainId for account parent.
 * @param name Name of the account, project, or rlease.
 */
export function generateID(parentID: ethers.BigNumberish, name: string): ethers.BigNumberish {
	const nameBytes = ethers.utils.toUtf8Bytes(name);
	const nameHash = ethers.utils.keccak256(nameBytes);
	return ethers.utils.solidityKeccak256([ "uint256", "bytes32" ], [ parentID, nameHash ]);
}

/**
 * Create a Valist client using the given web3 provider.
 * 
 * @param web3 Web3 provider to use for transactions.
 * @param wallet Optional wallet for signining transactions.
 */
export async function createClient(web3: ethers.providers.ExternalProvider, wallet?: ethers.Wallet): Promise<Client> {
	const web3Provider = new ethers.providers.Web3Provider(web3);
	const { chainId } = await web3Provider.getNetwork();

	const registryAddress = getRegistryAddress(chainId);
	const licenseAddress = getLicenseAddress(chainId);
	const paymasterAddress = getPaymasterAddress(chainId);

	// recommended settings for polygon see below for more info
	// https://docs.opengsn.org/networks/polygon/polygon.html
	const config: Partial<GSNConfig> = {
		paymasterAddress,
		relayLookupWindowBlocks: 990,
		relayRegistrationLookupBlocks: 990,
		pastEventsQueryMaxPageSize: 990,
	};

	// @ts-ignore
	const relayProvider = RelayProvider.newProvider({ provider: web3, config });
	await relayProvider.init();

	// add the wallet account if set
	let signerAddress: string | undefined;
	if (wallet) {
		relayProvider.addAccount(wallet.privateKey);
		signerAddress = wallet.address;
	}

	// @ts-ignore
	const metaProvider = new ethers.providers.Web3Provider(relayProvider);
	const metaSigner = metaProvider.getSigner(signerAddress);
	const web3Signer = web3Provider.getSigner();

	const registry = new ethers.Contract(registryAddress, registryContract.abi, metaSigner);
	const license = new ethers.Contract(licenseAddress, licenseContract.abi, web3Signer);
	const ipfs = create({ url: 'https://pin.valist.io' });

	return new Client(registry, license, ipfs, 'https://gateway.valist.io');
}

export function getRegistryAddress(chainId: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return '0xc70A069eC7F887a7497a4bdC7bE666C1e18c8DC3';
		case 80001: // Mumbai testnet
			return '0xC2E442A911A70097093E5d51A9224A1587D888cb';
		case 1337: // Deterministic Ganache
			return '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

export function getPaymasterAddress(chainId: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return 'TODO';
		case 80001: // Mumbai testnet
			return '0xf58cd651b4CDF7E32F5C148139eaacbc72272872';
		case 1337: // Deterministic Ganache
			return '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

export function getLicenseAddress(chainId: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return '0xb85ed41d49Eba25aE6186921Ea63b6055903e810';
		case 80001: // Mumbai testnet
			return '0x980Fb2419437e5E4B8dB2AdCD6Ff374b9Ef1b688';
		case 1337: // Deterministic Ganache
			return '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}