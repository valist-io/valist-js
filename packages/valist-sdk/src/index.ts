import { ethers, providers } from 'ethers';
import Client from './client';
import * as contracts from './contracts';
import * as graphql from './graphql';

export type Provider = providers.Provider | ethers.Signer;

// additional options for configuring the client
export interface Options {
  chainId: number;
  ipfsHost: string;
  ipfsGateway: string;
  metaTx: boolean;
  wallet: ethers.Wallet;
  registryAddress: string;
  licenseAddress: string;
  subgraphUrl: string;
}

export type IPFSOptions = {
  wrapWithDirectory?: boolean;
  cidVersion?: number;
  progress?: (bytes: number) => void;
}

export type IPFSCLIENT = {
  add: (value: any, options: IPFSOptions) => Promise<string | undefined>;
  addAll: (values: any, options: any) => Promise<string[]>;
}

const createIPFS = (value: Object): IPFSCLIENT => {
  const API = 'https://pin-1.valist.io/api/v0';

  const addAll = async (values: any[], options: IPFSOptions) => {
    let data: { Name: string, Hash: string }[] = [];
    let path = `${API}/add?progress=true`;

    if (options?.cidVersion == 0 || options?.cidVersion == 1)
      path += `&cid-version=${options.cidVersion}`;

    if (options?.wrapWithDirectory)
      path += '&wrap-with-directory=true';

    const formData = new FormData();
    for (const value of values) {
      console.log(`adding ${value.path} to form`);
      formData.append('file', value.content, value.path);
    }

    const res = await fetch(path, {
      method: 'post',
      body: formData
    });

    if (res.status === 400)
      return [];

    if (res?.body) {
      const resText = await res.text();
      const jsonLines = resText.split('\n');
      jsonLines.forEach(line => {
        if (line) {
          const jsonValue = JSON.parse(line);
          data.push(jsonValue);
        }
      });
    }

    const hashes: string[] = [];
    data.forEach(item =>
      item?.Hash && hashes.push(item.Hash)
    );

    return hashes;
  }

  const add = async (value: any, options: any) => {
    const data = await addAll([value], options);
    if (data.length !== 0)
      return data[0];
  }

  return {
    addAll,
    add,
  }
};

/**
 * Create a read-only Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export function createReadOnly(provider: providers.JsonRpcProvider, options: Partial<Options>): Client {
  const chainId = options.chainId || 137;

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(chainId);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(chainId);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(chainId);

  const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);

  const ipfs = createIPFS({ url: options.ipfsHost || 'https://pin-1.valist.io/api/v0' });
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, undefined, false);
}

/**
 * Create a Valist client using the given JSON RPC provider.
 * 
 * @param providerOrSigner Provider or signer to use for transactions
 * @param options Additional client options
 */
export async function create(providerOrSigner: Provider, options: Partial<Options>): Promise<Client> {
  let signer: ethers.Signer | undefined;
  let provider: providers.Provider | undefined;

  // coerce the signer and provider out of the merged types
  if (ethers.Signer.isSigner(providerOrSigner)) {
    signer = providerOrSigner as ethers.Signer;
    provider = signer.provider;
  } else {
    provider = providerOrSigner as providers.Web3Provider;
    signer = (provider as providers.Web3Provider).getSigner();
  }

  if (!provider) {
    throw new Error('invalid provider');
  }

  if (!options.chainId) {
    const network = await provider.getNetwork();
    options.chainId = network.chainId;
  }

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(options.chainId || 137);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(options.chainId || 137);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(options.chainId || 137);

  const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, signer);

  let ipfsConfig: any = {
    url: options.ipfsHost || 'https://pin-1.valist.io/api/v0',
  };

  // if in Node.js environment, disable connection keepAlive due to:
  // https://github.com/ipfs/kubo/issues/6402
  // https://github.com/ipfs/go-ipfs-cmds/pull/116
  // https://github.com/ipfs/kubo/issues/5168#issuecomment-402806747
  if (typeof window === 'undefined') {
    ipfsConfig.agent = require('https').Agent({ keepAlive: false });
  }

  const ipfs = createIPFS(ipfsConfig);
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, signer, options.metaTx);
}

export * from './types';
export * from './utils';

export { Client, contracts, graphql };
