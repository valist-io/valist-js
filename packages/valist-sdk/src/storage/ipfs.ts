import { Team, Project, Release } from '../index';
import { StorageAPI } from './index';
import * as types from 'ipfs-core-types';
import { create } from 'ipfs-http-client';
import { toString } from 'uint8arrays/to-string';
import { concat } from 'uint8arrays/concat';
import all from 'it-all';

export class IPFS implements StorageAPI {
	ipfs: types.IPFS;

	constructor(ipfs: types.IPFS) {
		this.ipfs = ipfs;
	}

	async readTeamMeta(metaURI: string): Promise<Team> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async readProjectMeta(metaURI: string): Promise<Project> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async readReleaseMeta(metaURI: string): Promise<Release> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async writeTeamMeta(team: Team): Promise<string> {
		return await this.write(JSON.stringify(team));
	}

	async writeProjectMeta(project: Project): Promise<string> {
		return await this.write(JSON.stringify(project));
	}

	async writeReleaseMeta(release: Release): Promise<string> {
		return await this.write(JSON.stringify(release));
	}

	async write(data: string | File): Promise<string> {
		const { cid } = await this.ipfs.add(data);
		return `/ipfs/${cid.toString()}`;
	}

	async read(uri: string): Promise<string> {
		const data = await all(this.ipfs.cat(uri));
		return toString(concat(data));
	}
}

/**
 * Creates the default IPFS storage provider.
 */
export function createIPFS(): StorageAPI {
	const ipfs = create({host: 'pin.valist.io', port: 80});	
	return new IPFS(ipfs);
}