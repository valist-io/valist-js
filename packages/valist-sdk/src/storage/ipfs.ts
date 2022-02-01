import { Team, Project, Release, replacer, reviver } from '../index';
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
		return JSON.parse(data, reviver);
	}

	async readProjectMeta(metaURI: string): Promise<Project> {
		const data = await this.read(metaURI);
		return JSON.parse(data, reviver);
	}

	async readReleaseMeta(metaURI: string): Promise<Release> {
		const data = await this.read(metaURI);
		return JSON.parse(data, reviver);
	}

	async writeTeamMeta(team: Team): Promise<string> {
		const data = JSON.stringify(team, replacer);
		return await this.write(data);
	}

	async writeProjectMeta(project: Project): Promise<string> {
		const data = JSON.stringify(project, replacer);
		return await this.write(data);
	}

	async writeReleaseMeta(release: Release): Promise<string> {
		const data = JSON.stringify(release, replacer);
		return await this.write(data);
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
	const ipfs = create({ host: 'pin.valist.io', port: 443, protocol: 'https' });
	return new IPFS(ipfs);
}