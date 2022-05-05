import * as registryContract from './Registry.json';
import * as licenseContract from './License.json';

export const registryABI = registryContract.abi;
export const licenseABI = licenseContract.abi;

export const registryBytecode = registryContract.bytecode;
export const licenseBytecode = licenseContract.bytecode;

export const chainIds = [137, 80001, 1337];

export function getRegistryAddress(chainId: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return '0xD504d012D78B81fA27288628f3fC89B0e2f56e24';
		case 80001: // Mumbai testnet
			return '0xD504d012D78B81fA27288628f3fC89B0e2f56e24';
		case 1337: // Deterministic Ganache
			return '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

export function getPaymasterAddress(chainId?: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return '0x137F8009fc7795dD8a004fdb38852F54368194e8';
		case 80001: // Mumbai testnet
			return '0x137F8009fc7795dD8a004fdb38852F54368194e8';
		case 1337: // Deterministic Ganache
			return '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

export function getLicenseAddress(chainId: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return '0x3cE643dc61bb40bB0557316539f4A93016051b81';
		case 80001: // Mumbai testnet
			return '0x3cE643dc61bb40bB0557316539f4A93016051b81';
		case 1337: // Deterministic Ganache
			return '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}
