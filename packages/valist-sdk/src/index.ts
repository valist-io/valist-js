import { ethers, providers } from 'ethers';
import { create as createIPFS } from 'ipfs-http-client';
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

  // @ts-expect-error
  const ipfs = createIPFS(options.ipfsHost || 'https://pin-infura.valist.io');
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
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);

  // @ts-expect-error
  const ipfs = createIPFS(options.ipfsHost || 'https://pin-infura.valist.io');
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, signer, options.metaTx);
}

export * from './types';
export * from './utils';

export { Client, contracts, graphql };
