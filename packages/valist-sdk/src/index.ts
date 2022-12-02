import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';
import { Client, MetaClient } from './client';
import * as contracts from './contracts';
import * as graphql from './graphql';

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
  subgraphUrl: string;
}

/**
 * Create a read-only Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export function createReadOnly(provider: Provider, options: Partial<Options>): Client {
  const chainId = options.chainId || 137;

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(chainId);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(chainId);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(chainId);

  const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);

  const ipfsHost = options.ipfsHost || 'https://pin.valist.io';
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';

  return new Client(registry, license, ipfsGateway, subgraphUrl);
}

/**
 * Create a Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export async function create(provider: Provider, options: Partial<Options>): Promise<Client> {
  if (!options.chainId) {
    options.chainId = (await provider.getNetwork()).chainId;
  }
  if (!options.registryAddress) {
    options.registryAddress = contracts.getRegistryAddress(options.chainId);
  }
  if (!options.licenseAddress) {
    options.licenseAddress = contracts.getLicenseAddress(options.chainId);
  }
  if (!options.subgraphUrl) {
    options.subgraphUrl = graphql.getSubgraphUrl(options.chainId);
  }
  if (!options.ipfsHost) {
    options.ipfsHost = 'https://pin.valist.io';
  }
  if (!options.ipfsGateway) {
    options.ipfsGateway = 'https://gateway.valist.io';
  }

  const signerOrProvider = provider.getSigner();
  const registry = new ethers.Contract(options.registryAddress, contracts.registryABI, signerOrProvider);
  const license = new ethers.Contract(options.licenseAddress, contracts.licenseABI, signerOrProvider);

  if (options.metaTx && contracts.chainIds.includes(options.chainId)) {
    const biconomy = await createBiconomy(provider, options);
    return new MetaClient(registry, license, options.ipfsGateway, options.subgraphUrl, biconomy);
  }

  return new Client(registry, license, options.ipfsGateway, options.subgraphUrl);
}

function getBiconomyApiKey(chainId: number): string {
  switch (chainId) {
    case 137: // Polygon mainnet
      return '9Jk9qeZLi.56894f4d-0437-47c1-b9da-16b269c7bab7';
    case 80001: // Mumbai testnet
      return 'qLW9TRUjQ.f77d2f86-c76a-4b9c-b1ee-0453d0ead878';
    default:
      throw new Error(`unsupported network chainId=${chainId}`);
  }
}

async function createBiconomy(provider: Provider, options: Partial<Options>): Promise<Biconomy> {
  const biconomyOpts = {
    apiKey: getBiconomyApiKey(options.chainId ?? 137),
    contractAddresses: [options.registryAddress ?? ''],
  };

  const unwrapped = 'provider' in provider ? provider.provider : provider;
  const biconomy = new Biconomy(unwrapped as any, biconomyOpts);
  await biconomy.init();

  biconomy.on('error', (data: any) => {
    console.error('biconomy error', data);
  });

  return biconomy;
}

export * from './types';
export * from './utils';

export { Client, contracts, graphql };
