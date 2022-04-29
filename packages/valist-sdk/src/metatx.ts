import { ethers } from 'ethers';
import { RelayProvider, GSNConfig } from '@opengsn/provider';
import * as contracts from './contracts';
import { Options } from './';

export async function createRelaySigner(provider: ethers.providers.Web3Provider, options: Partial<Options>): Promise<ethers.providers.JsonRpcSigner> {
	const paymasterAddress = contracts.getPaymasterAddress(options.chainId);

	// recommended settings for polygon see below for more info
	// https://docs.opengsn.org/networks/polygon/polygon.html
	const config: Partial<GSNConfig> = {
		paymasterAddress,
		relayLookupWindowBlocks: 990,
		relayRegistrationLookupBlocks: 990,
		pastEventsQueryMaxPageSize: 990,
	};

	// @ts-ignore
	const relayProvider = RelayProvider.newProvider({ provider: provider.provider, config });
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