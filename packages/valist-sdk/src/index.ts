import { ethers } from 'ethers';
import { RelayProvider, GSNConfig } from '@opengsn/provider';
import type WalletConnectProvider from '@walletconnect/web3-provider';
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

export async function createRelaySigner({ provider }: ethers.providers.Web3Provider, options: Partial<Options>): Promise<ethers.providers.JsonRpcSigner> {
	const paymasterAddress = contracts.getPaymasterAddress(options.chainId);

	// recommended settings for polygon see below for more info
	// https://docs.opengsn.org/networks/polygon/polygon.html
	const config: Partial<GSNConfig> = {
		paymasterAddress,
		relayLookupWindowBlocks: 990,
		relayRegistrationLookupBlocks: 990,
		pastEventsQueryMaxPageSize: 990,
    preferredRelays: [
      'https://relay-polygon.enzyme.finance/gsn1'
    ],
    loggerConfiguration: {
      logLevel: 'error'
    }
	};

  // fix for wallet connect provider not returning standard responses
  // replace this once opengsn is able to handle an ethers wrapped signer
  if ((provider as WalletConnectProvider).isWalletConnect) {
    const walletConnectProvider = provider as WalletConnectProvider;
    walletConnectProvider.send = async (args: any, callback: any) => {
      walletConnectProvider.request(args)
        .then((result: any) => callback(null, { result }))
        .catch((error: any) => callback(error, undefined));
    }
    walletConnectProvider.sendAsync = (args: any, callback: any) => {
      walletConnectProvider.request(args)
        .then((result: any) => callback(null, { result }))
        .catch((error: any) => callback(error, undefined));
    }
  }

	// @ts-ignore
	const relayProvider = RelayProvider.newProvider({ provider, config });
	await relayProvider.init();

	// add the wallet account if set
	let signerAddress: string | undefined;
	if (options.wallet) {
		relayProvider.addAccount(options.wallet.privateKey);
		signerAddress = options.wallet.address;
	}

	// @ts-ignore
	const metaProvider = new ethers.providers.Web3Provider(relayProvider);
	return metaProvider.getSigner(signerAddress);
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

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(options.chainId || 137);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(options.chainId || 137);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(options.chainId || 137);

  let registry: ethers.Contract;
  let license: ethers.Contract;

  const web3Provider = provider as ethers.providers.Web3Provider;
  if (web3Provider.provider && web3Provider.getSigner) {
    const web3Signer = web3Provider.getSigner();

    // if meta transactions enabled setup opengsn relay signer
    let metaSigner: ethers.providers.JsonRpcSigner;
    if (options.metaTx && contracts.chainIds.includes(options.chainId || 137)) {
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

  return new Client(registry, license, ipfsGateway, subgraphUrl);
}

export * from './types';
export * from './utils';

export { Client, contracts, graphql };
