import { TeamMeta, ProjectMeta, ReleaseMeta, replacer, reviver } from '../index';
import { StorageAPI } from './index';
import { PinataClient } from '@pinata/sdk';

export class Pinata implements StorageAPI {
	pinata: PinataClient;
	gateway: string;

	constructor(pinata: PinataClient, gateway: string) {
		this.pinata = pinata;
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

	async writeJSON(data: string): Promise<string> {
		const res = await this.pinata.pinJSONToIPFS(data);
		return `/ipfs/${res.IpfsHash}`;
	}

	async writeFile(data: File): Promise<string> {
		const res = await this.pinata.pinFileToIPFS(data.stream());
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
export async function createPinata(apiKey: string, secretApiKey: string, gateway: string): Promise<StorageAPI> {
	const pinataSDK = require('@pinata/sdk');
	const pinata = pinataSDK(apiKey, secretApiKey);
	await pinata.testAuthentication();
	return new Pinata(pinata, gateway);
}
