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
			return '0xc70A069eC7F887a7497a4bdC7bE666C1e18c8DC3';
		case 80001: // Mumbai testnet
			return '0x83B5f729DB18E2Cae6388A414210543581f9df17';
		case 1337: // Deterministic Ganache
			return '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

export function getPaymasterAddress(chainId?: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return 'TODO';
		case 80001: // Mumbai testnet
			return '0xe59447Fb03f44Af0a483840a7A6059a4B03FB4fC';
		case 1337: // Deterministic Ganache
			return '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

export function getLicenseAddress(chainId: number): string {
	switch(chainId) {
		case 137: // Polygon mainnet
			return '0xb85ed41d49Eba25aE6186921Ea63b6055903e810';
		case 80001: // Mumbai testnet
			return '0xF0D58AacF271629B2c598d557E8c2FCF047FfD30';
		case 1337: // Deterministic Ganache
			return '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24';
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}
