import { TeamMeta, ProjectMeta, ReleaseMeta, LicenseMeta } from '../index';
import { StorageAPI } from './index';
import * as types from 'ipfs-core-types';
import { create } from 'ipfs-http-client';
import { toString } from 'uint8arrays/to-string';
import { concat } from 'uint8arrays/concat';
import all from 'it-all';

export class IPFS implements StorageAPI {
	ipfs: types.IPFS;
	gateway: string;

	constructor(ipfs: types.IPFS, gateway: string = 'https://gateway.valist.io') {
		this.ipfs = ipfs;
		this.gateway = gateway;
	}

	async writeJSON(data: string): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `${this.gateway}/ipfs/${cid.toString()}`;
	}

	async writeFile(data: File): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `${this.gateway}/ipfs/${cid.toString()}`;
	}

	async writeFolder(data: File[]): Promise<string> {
		const opts = { wrapWithDirectory: true };
		const cids: string[] = [];
		for await (const res of this.ipfs.addAll(data, opts)) {
			cids.push(res.cid.toString());
		}
		return `${this.gateway}/ipfs/${cids[cids.length - 1]}`;
	}
}

/**
 * Creates the default IPFS storage provider.
 */
export function createIPFS(): StorageAPI {
	const ipfs = create({ host: 'pin.valist.io', port: 443, protocol: 'https' });
	return new IPFS(ipfs);
}