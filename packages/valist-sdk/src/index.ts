import { Client, createClient, generateID } from './client';

export class AccountMeta {
	/** account image */
	public image?: string;
	/** account friendly name. */
	public name?: string;
	/** short description of the account. */
	public description?: string;
	/** link to the account website. */
	public external_url?: string;
}

export class ProjectMeta {
	/** project image */
	public image?: string;
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public short_description?: string;
	/** extended description of the project. */
	public description?: string;
	/** link to the project website. */
	public external_url?: string;
}

export class ReleaseMeta {
	/** project image */
	public image?: string;
	/** full release name. */
	public name?: string;
	/** short description of the release. */
	public description?: string;
	/** link to the release assets. */
	public external_url?: string;
}

export { Client, createClient, generateID };