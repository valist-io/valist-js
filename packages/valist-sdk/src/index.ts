import { ethers } from 'ethers';
import { RelayProvider, GSNConfig } from '@opengsn/provider';
import type WalletConnectProvider from '@walletconnect/web3-provider';
import { create as createIPFS } from 'ipfs-http-client';
import Client from './client';
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
export function createReadOnly(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, options: Partial<Options>): Client {
  const chainId = options.chainId || 137;

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(chainId);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(chainId);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(chainId);

  const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);

  const ipfsHost = options.ipfsHost || 'https://pin.valist.io';
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';
  const ipfs = createIPFS({ url: ipfsHost });

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, provider as ethers.providers.Web3Provider, options.metaTx);
}

/**
 * Create a Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export async function create(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, options: Partial<Options>): Promise<Client> {
  if (!options.chainId) {
    const network = await provider.getNetwork();
    options.chainId = network.chainId;
  }

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(options.chainId || 137);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(options.chainId || 137);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(options.chainId || 137);

  let registry: ethers.Contract;
  let license: ethers.Contract;

  const web3Provider = provider as ethers.providers.Web3Provider;
  if (web3Provider.provider && web3Provider.getSigner) {
    const web3Signer = web3Provider.getSigner();

    registry = new ethers.Contract(registryAddress, contracts.registryABI, web3Signer);
    license = new ethers.Contract(licenseAddress, contracts.licenseABI, web3Signer);
  } else {
    registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
    license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);
  }

  const ipfsHost = options.ipfsHost || 'https://pin.valist.io';
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';
  const ipfs = createIPFS({ url: ipfsHost });

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, web3Provider, options.metaTx);
}

export * from './types';
export * from './utils';

export { Client, contracts, graphql };
