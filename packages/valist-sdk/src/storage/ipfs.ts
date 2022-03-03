import { TeamMeta, ProjectMeta, ReleaseMeta, LicenseMeta } from '../index';
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

	async readTeamMeta(metaURI: string): Promise<TeamMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async readProjectMeta(metaURI: string): Promise<ProjectMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async readReleaseMeta(metaURI: string): Promise<ReleaseMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async readLicenseMeta(metaURI: string): Promise<LicenseMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data);
	}

	async writeTeamMeta(team: TeamMeta): Promise<string> {
		const data = JSON.stringify(team);
		return await this.write(data);
	}

	async writeProjectMeta(project: ProjectMeta): Promise<string> {
		const data = JSON.stringify(project);
		return await this.write(data);
	}

	async writeReleaseMeta(release: ReleaseMeta): Promise<string> {
		const data = JSON.stringify(release);
		return await this.write(data);
	}

	async writeLicenseMeta(license: LicenseMeta): Promise<string> {
		const data = JSON.stringify(license);
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