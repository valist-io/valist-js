import { ethers } from 'ethers';
import { RelayProvider, GSNConfig } from '@opengsn/provider';
import { create as createIPFS } from 'ipfs-http-client';
import Client from './client';
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
	/** project image */
	public image?: string;
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public short_description?: string;
	/** extended description of the project. */
	public description?: string;
	/** link to the project website. */
	public external_url?: string;
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

/**
 * Create a read-only Valist client using the given RPC URL.
 * 
 * @param url URL of the Ethereum RPC to use.
 */
export async function createReadOnly(url: string): Promise<Client> {
	const provider = new ethers.providers.JsonRpcProvider(url);
	const { chainId } = await provider.getNetwork();

	const registryAddress = contracts.getRegistryAddress(chainId);
	const licenseAddress = contracts.getLicenseAddress(chainId);
	const paymasterAddress = contracts.getPaymasterAddress(chainId);

	const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
	const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);
	const ipfs = createIPFS({ url: 'https://pin.valist.io' });

	return new Client(registry, license, ipfs, 'https://gateway.valist.io');
} 

/**
 * Create a Valist client using the given web3 provider.
 * 
 * @param web3 Web3 provider to use for transactions.
 * @param wallet Wallet for signing transactions (optional).
 */
export async function createWeb3(web3: ethers.providers.ExternalProvider, wallet?: ethers.Wallet): Promise<Client> {
	const web3Provider = new ethers.providers.Web3Provider(web3);
	const { chainId } = await web3Provider.getNetwork();

	const registryAddress = contracts.getRegistryAddress(chainId);
	const licenseAddress = contracts.getLicenseAddress(chainId);
	const paymasterAddress = contracts.getPaymasterAddress(chainId);

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

	const registry = new ethers.Contract(registryAddress, contracts.registryABI, metaSigner);
	const license = new ethers.Contract(licenseAddress, contracts.licenseABI, web3Signer);
	const ipfs = createIPFS({ url: 'https://pin.valist.io' });

	return new Client(registry, license, ipfs, 'https://gateway.valist.io');
}

/**
 * Generate account, project, and release IDs.
 * 
 * @param parentID ID of the parent account or release. Use chainId for accounts.
 * @param name Name of the account, project, or rlease.
 */
export function generateID(parentID: ethers.BigNumberish, name: string): ethers.BigNumberish {
	const nameBytes = ethers.utils.toUtf8Bytes(name);
	const nameHash = ethers.utils.keccak256(nameBytes);
	return ethers.utils.solidityKeccak256([ "uint256", "bytes32" ], [ parentID, nameHash ]);
}

export { Client, contracts };
