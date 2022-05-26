import { ethers } from 'ethers';
import { create as createIPFS } from 'ipfs-http-client';
import Client from './client';
import { createRelaySigner } from './metatx';
import * as contracts from './contracts';


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

// Valist GraphQL Queries
export const RELEASE_QUERY = `
query {
	releases{
	  id
	  name
	  metaURI
	  project{
		id
	  }
	}
}
`
// Query for listing releases for a particular project ID
export const PROJECT_RELEASE_QUERY = `
query($projectID: String!){
    project(id: $projectID){
        releases{
            id
            name
            metaURI
            project{
                id
            }
        }
    }
} 
`

export const USER_LOGS_QUERY = `
  query UserLogs($address: String, $count: Int){
    logs (where: {sender: $address}, orderBy: blockTime, orderDirection: "desc", first: $count){
      id
      type
      blockTime
      account {
        id
        name
      }
      project {
        id
        name
        account {
          name
        }
      }
      release{
        id
        name
      }
      sender
    }
  }
`;

export const ACCOUNT_LOGS_QUERY = `
  query TeamLogs($account: String, $count: Int){
    logs (where: {account: $account}, first: $count){
      id
      type
      account
      project
      release
      sender
    }
  }
`;

export const PROJECT_LOGS_QUERY = `
  query ProjectLogs($account: String, $project: String, $count: Int){
    logs (where: {account: $account, project: $project}, first: $count){
      id
      type
      account
      project
      release
      sender
    }
  }
`;

export const USER_ACCOUNTS = `
  query Projects($address: String){
    users(where: {id: $address}) {
      id
      accounts {
        name
        projects{
          name
        }
      }
    }
  }
`;

export const USER_PROJECTS = `
  query Projects($address: String){
    users(where: {id: $address}) {
      id
      accounts {
        name
        projects{
          name
        }
      }
      projects {
        id
        name
        metaURI
        account {
          name
        }
      }
    }
  }
`;

export const USER_HOMEPAGE = `
  query Homepage($address: String){
    users(where: {id: $address}) {
      id
      accounts {
        name
        projects{
          id
          name
          metaURI
          account {
            name
          }
        }
        metaURI
      }
      projects {
        id
        name
        metaURI
        account {
          name
        }
         product {
          id
        }
      }
    }
  }
`;

export const ACCOUNT_PROFILE_QUERY = `
  query Account($account: String) {
    accounts(where: { name: $account} ){
      id
      name
      metaURI
      members{
        id
      }
      projects {
        id
        name
        metaURI
        account {
          name
        }
      }
      logs(orderBy: blockTime, orderDirection: "desc"){
        id
        type
        blockTime
        account {
          id
          name
        }
        project {
          id
          name
          account {
            name
          }
        }
        release(orderBy: blockTime, orderDirection: "desc"){
          id
          name
        }
        sender
      }
    }
  }
`;


export const PROJECT_SEARCH_QUERY = `
  query Project($search: String){
    projects(where:{name_contains: $search}){
      id
      name
      metaURI
      account {
        name
      }
    }
	
  }
`;

export const PROJECT_PROFILE_QUERY = `
  query ProjectProfile($projectID: String){
    projects(where: {id: $projectID}){
      id
      name
      metaURI
      account {
        name
      }
      releases(orderBy: blockTime, orderDirection: "desc") {
        name
        metaURI
        blockTime
      }
      members{
        id
      }
      logs(orderBy: blockTime, orderDirection: "desc"){
        id
        type
        blockTime
        account {
          id
          name
        }
        project {
          id
          name
          account {
            name
          }
        }
        release{
          id
          name
        }
        sender
      }
    }
  }
`;

export const ADDR_PROFILE_QUERY = `
  query AddrProfile($address: String){
    keys (where: { address: $address} ){
      id
      address
      account {
        id
        project{
          id
          metaURI
          name
        }
      }
      project {
        id
        name
        metaURI
        account {
          name
        }
      }
    }
  }
`;


// providers accepted by the client constructor helpers
export type Provider = ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider;
export let VALIST_GRAPHQL_URL: string; // set by the client constructor
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

  switch (chainId) {
    case 137: // Polygon mainnet
      VALIST_GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/valist-io/valist"
    case 80001: // Mumbai testnet
      VALIST_GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai"
  } 

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

  switch (options.chainId) {
    case 137: // Polygon mainnet
      VALIST_GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/valist-io/valist"
    case 80001: // Mumbai testnet
      VALIST_GRAPHQL_URL = "https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai"
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
  return ethers.utils.solidityKeccak256(["uint256", "bytes32"], [parentID, nameHash]);
}

export { Client, contracts };
