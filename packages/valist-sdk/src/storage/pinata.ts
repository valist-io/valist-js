import { TeamMeta, ProjectMeta, ReleaseMeta, LicenseMeta, replacer, reviver } from '../index';
import { StorageAPI } from './index';

export class Pinata implements StorageAPI {
	jwt: string;
	gateway: string;

	constructor(jwt: string, gateway: string) {
		this.jwt = jwt;
		this.gateway = gateway;
	}

	async readTeamMeta(metaURI: string): Promise<TeamMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data, reviver);
	}

	async readProjectMeta(metaURI: string): Promise<ProjectMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data, reviver);
	}

	async readReleaseMeta(metaURI: string): Promise<ReleaseMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data, reviver);
	}

	async readLicenseMeta(metaURI: string): Promise<LicenseMeta> {
		const data = await this.read(metaURI);
		return JSON.parse(data, reviver);
	}

	async writeTeamMeta(team: TeamMeta): Promise<string> {
		const data = JSON.stringify(team, replacer);
		return await this.writeJSON(data);
	}

	async writeProjectMeta(project: ProjectMeta): Promise<string> {
		const data = JSON.stringify(project, replacer);
		return await this.writeJSON(data);
	}

	async writeReleaseMeta(release: ReleaseMeta): Promise<string> {
		const data = JSON.stringify(release, replacer);
		return await this.writeJSON(data);
	}
	
	async writeLicenseMeta(license: LicenseMeta): Promise<string> {
		const data = JSON.stringify(license, replacer);
		return await this.writeJSON(data);
	}

	async writeJSON(data: string): Promise<string> {
		const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
		const res = await fetch(url, { 
			method: 'POST',
			body: data,
			headers: {
				'Authorization': `Bearer ${this.jwt}`,
				'Content-Type': 'application/json',
			}
		}).then(res => res.json());

		return `/ipfs/${res.IpfsHash}`;
	}

	async writeFile(data: File): Promise<string> {
		const form = new FormData();
		form.append('file', data);
		
		const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
		const res = await fetch(url, { 
			method: 'POST', 
			body: form,
			headers: {
				'Authorization': `Bearer ${this.jwt}`
			}
		}).then(res => res.json());

		return `/ipfs/${res.IpfsHash}`;
	}

	async read(uri: string): Promise<string> {
		const res = await fetch(this.gateway + uri);
		return res.text();
	}
}

/**
 * Creates the default Pinata storage provider.
 */
export function createPinata(jwt: string, gateway: string): StorageAPI {
	return new Pinata(jwt, gateway);
}