import { Client, Options, createClient, Provider } from './client';

export class TeamMeta {
	/** team image */
	public image?: string;
	/** team friendly name. */
	public name?: string;
	/** short description of the team. */
	public description?: string;
	/** link to the team website. */
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
	/** type used by clients to handle project */
	public type?: string;
	/** tags used for searching and categorization */
	public tags?: string[];
	/** videos and graphics of the project */
	public gallery?: {
		name: string,
		src: string,
		type: string,
		preview?: string,
	}[];
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
	/** optional list of licenses linked to the project */
	public licenses?: string[];
}

export class LicenseMeta {
	/** license image */
	public image?: string;
	/** license friendly name */
	public name?: string;
	/** short description of the license. */
	public description?: string;
	/** link to the license website. */
	public external_url?: string;
}

export { Client, Options, createClient, Provider };