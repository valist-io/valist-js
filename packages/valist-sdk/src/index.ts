import { ethers } from 'ethers';
import { create as createIPFS, urlSource } from 'ipfs-http-client';
import Client from './client';
import { createRelaySigner } from './metatx';
import * as contracts from './contracts';
import { getSubgraphAddress } from './graphql';


// Valist Types
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
	public gallery?: GalleryMeta[];
}

export class GalleryMeta {
	public name: string = '';
	public src: string = '';
	public type: string = '';
	public preview?: string;
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
	/** source code snapshot */
	public source?: string;
	/** installable binaries */
	public install?: InstallMeta;
}

export class InstallMeta {
	/** binary name */
	public name?: string;
	/** darwin/amd64 path */
	public darwin_amd64?: string;
	/** darwin/arm64 path */
	public darwin_arm64?: string;
	/** linux/386 path */
	public linux_386?: string;
	/** linux/amd64 path */
	public linux_amd64?: string;
	/** linux/arm path */
	public linux_arm?: string;
	/** linux/arm64 path */
	public linux_arm64?: string;
	/** windows/386 path */
	public windows_386?: string;
	/** windows/amd64 path */
	public windows_amd64?: string;
}

export type Account = {
  id: string,
  name?: string,
  metaURI?: string,

  members?: string[],
  projects?: Project[],
  logs?: Log[],

  blockTime?: number,
  blockNumber?: number,
  logIndex?: number
}


type Project = {
  id: string,
  name?: string,
  metaURI?: string,

  account?: string,
  product?: string,
  members?: Account[], //list of accounts
  releases?: Release[]
  logs?: Log[]

  blockTime?: number
  blockNumber?: number
  logIndex?: number
}

type Release = {
  id: string,
  name?: string,
  metaURI?: string,

  project?: Project,
  signers?: string[],
  logs?: Log[],

  blockTime?: number,
  blockNumber?: number,
  logIndex?: number
}

type Product = {
  id: string,
  limit?: number,
  supply?: number,

  royaltyAmount?: number,
  royaltyRecipient?: string,

  project?: Project,
  currencies?: Currency[],
  purchases?: Purchase[],
}

type Currency = {
  id: string,
  token?: string,
  product?: Product,
  price?: number,
  balance?: number
}

type Purchase = {
  id: string,
  recipient?: string,
  product?: Product
  price?: number,
  blockTime?: number
  blockNumber?: number
  logIndex?: number
}

type User = {
  id: string,
  accounts?: Account[],
  projects?: Project[]
}

type Log = {
  id: string,
  type?: string,

  sender?: string,
  member?: string,

  account?: Account,
  project?: Project,
  release?: Release,

  blockTime?: number,
  blockNumber?: number,
  logIndex?: number,
}

// providers accepted by the client constructor helpers
export type Provider = ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider;
// set by the client constructor
export let VALIST_GRAPHQL_URL: string;
// additional options for configuring the client
export interface Options {
  chainId: number;
  ipfsHost: string;
  ipfsGateway: string;
  metaTx: boolean;
  wallet: ethers.Wallet;
  registryAddress: string;
  licenseAddress: string;
  subgraphAddress: string;
}

/**
 * Create a read-only Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export function createReadOnly(provider: Provider, options: Partial<Options>): Client {
  const chainId = options.chainId || 137;

  VALIST_GRAPHQL_URL = options.subgraphAddress || getSubgraphAddress(chainId);

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

  VALIST_GRAPHQL_URL = options.subgraphAddress || getSubgraphAddress(options.chainId);

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
  return ethers.utils.solidityKeccak256(["uint256", "bytes32"], [parentID, nameHash]);
}

/**
 * Import a source archive from an external URL.
 * 
 * @param source URL with the following format:
 * - github.com/<owner>/<repo>/<ref>
 * - gitlab.com/<owner>/<repo>/<ref>
 */
export function archiveSource(source: string) {
	const [site, owner, repo, ...refs] = source.split('/');
	switch (site) {
		case 'github.com':
			const ref = refs.join('/');
			return urlSource(`https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`);
		case 'gitlab.com':
			const id = encodeURIComponent(`${owner}/${repo}`);
			const sha = encodeURIComponent(refs.join('/'));
			return urlSource(`https://gitlab.com/api/v4/projects/${id}/repository/archive?sha=${sha}`);
		default:
			throw new Error('invalid source url');
	}
}

export { Client, contracts };
