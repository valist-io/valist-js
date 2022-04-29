import { ethers } from 'ethers';
import { create as createIPFS } from 'ipfs-http-client';
import Client from './client';
import { createRelaySigner } from './metatx';
import * as contracts from './contracts';

export class AccountMeta {
	/** account image */
	public image?: string;
	/** account friendly name. */
	public name?: string;
	/** short description of the account. */
	public description?: string;
	/** link to the account website. */
	public external_url?: string;
}

export class ProjectMeta {
	/** project image used for profile pic */
	public image?: string;
	/** main project image used for discovery */
	public main_capsule?: string;
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public short_description?: string;
	/** extended description of the project. */
	public description?: string;
	/** link to the project website. */
	public external_url?: string;
	/** type used by clients to handle project */
	public type?: string;
	/** tags used for searching and categorization */
	public tags?: string[];
	/** videos and graphics of the project */
	public gallery?: {
		name: string,
		src: string,
		type: string,
		preview?: string,
	}[];
}

export class ReleaseMeta {
	/** project image */
	public image?: string;
	/** full release name. */
	public name?: string;
	/** short description of the release. */
	public description?: string;
	/** link to the release assets. */
	public external_url?: string;
}

// providers accepted by the client constructor helpers
export type Provider = ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider;

// additional options for configuring the client
export interface Options {
	chainId: number;
	ipfsHost: string;
	ipfsGateway: string;
	metaTx: boolean;
	wallet: ethers.Wallet;
	registryAddress: string;
	licenseAddress: string;
}

/**
 * Create a read-only Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
 export function createReadOnly(provider: Provider, options: Partial<Options>): Client {
	const chainId = options.chainId || 137;
	const registryAddress = options.registryAddress || contracts.getRegistryAddress(chainId);
	const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(chainId);

	const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
	const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);	

	const ipfsHost = options.ipfsHost || 'https://pin.valist.io';
	const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';
	const ipfs = createIPFS({ url: ipfsHost });

	return new Client(registry, license, ipfs, ipfsGateway);
}

/**
 * Create a Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export async function create(provider: Provider, options: Partial<Options>): Promise<Client> {
	if (!options.chainId) {
		const network = await provider.getNetwork();
		options.chainId = network.chainId;
	}

	const registryAddress = options.registryAddress || contracts.getRegistryAddress(options.chainId);
	const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(options.chainId);

	let registry: ethers.Contract;
	let license: ethers.Contract;

	if ((provider as ethers.providers.Web3Provider).provider) {
		const web3Provider = provider as ethers.providers.Web3Provider;
		const web3Signer = web3Provider.getSigner();

		// if meta transactions enabled setup opengsn relay signer
		let metaSigner: ethers.providers.JsonRpcSigner;

		if (options.metaTx && contracts.chainIds.includes(options.chainId)) {
			metaSigner = await createRelaySigner(web3Provider, options);
			console.log('Meta-transactions enabled');
		} else {
			console.log('Meta-transactions disabled');
			metaSigner = web3Signer;
		}
		
		registry = new ethers.Contract(registryAddress, contracts.registryABI, metaSigner);
		license = new ethers.Contract(licenseAddress, contracts.licenseABI, web3Signer);
	} else {
		registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
		license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);	
	}

	const ipfsHost = options.ipfsHost || 'https://pin.valist.io';
	const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';
	const ipfs = createIPFS({ url: ipfsHost });

	return new Client(registry, license, ipfs, ipfsGateway);
}

/**
 * Generate account, project, and release IDs.
 * 
 * @param parentID ID of the parent account or release. Use chainId for accounts.
 * @param name Name of the account, project, or rlease.
 */
export function generateID(parentID: ethers.BigNumberish, name: string): string {
	const nameBytes = ethers.utils.toUtf8Bytes(name);
	const nameHash = ethers.utils.keccak256(nameBytes);
	return ethers.utils.solidityKeccak256([ "uint256", "bytes32" ], [ parentID, nameHash ]);
}

export { Client, contracts };
