import { Team, Project, Release } from '../index';
import { IPFS } from './ipfs';

/**
 * Storage abstraction API.
 */
export interface StorageAPI {
	/**
	 * Read team metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readTeamMeta(metaURI: string): Promise<Team>;

	/**
	 * Read project metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readProjectMeta(metaURI: string): Promise<Project>;

	/**
	 * Read release metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readReleaseMeta(metaURI: string): Promise<Release>;

	/**
	 * Write team metadata to storage and return its URI.
	 * 
	 * @param team Team metadata.
	 */
	writeTeamMeta(team: Team): Promise<string>;

	/**
	 * Write project metadata to storage and return its URI.
	 * 
	 * @param project Project metadata.
	 */
	writeProjectMeta(project: Project): Promise<string>;
	
	/**
	 * Write release metadata to storage and return its URI.
	 * 
	 * @param release Release metadata.
	 */
	writeReleaseMeta(release: Release): Promise<string>;

	/**
	 * Write data to storage and return its URI.
	 * 
	 * @param data File or string to write.
	 */
	write(data: File | string): Promise<string> 

	/**
	 * Read data from storage.
	 * 
	 * @param uri URI of data.
	 */
	read(uri: string): Promise<string>
}

export { IPFS };