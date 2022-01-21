import { Client } from './client';
import * as Storage from './storage';
import * as Contract from './contract';

export class Team {
	/** team friendly name. */
	public name?: string;
	/** short description of the team. */
	public description?: string;
	/** link to the team website. */
	public homepage?: string;
}

export class Project {
	/** project friendly name */
	public name?: string;
	/** short description of the project. */
	public description?: string;
	/** link to the project website. */
	public homepage?: string;
	/** source code url for the project. */
	public repository?: string;
}

export class Release {
	/** full release name. */
	public name?: string;
	/** release version. */
	public version?: string;
	/** readme contents. */
	public readme?: string;
	/** license type. */
	public license?: string;
	/** list of dependencies. */
	public dependencies?: string[];
	/** mapping of names to artifacts. */
	public artifacts?: Map<string, Artifact>;
}

export class Artifact {
	/** SHA256 hash of the file. */
	public sha256?: string;
	/** path to the artifact file. */
	public provider?: string;
}

export { Client, Storage, Contract };