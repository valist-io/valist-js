import { TeamMeta, ProjectMeta, ReleaseMeta } from '../index';
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
	readTeamMeta(metaURI: string): Promise<TeamMeta>;

	/**
	 * Read project metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readProjectMeta(metaURI: string): Promise<ProjectMeta>;

	/**
	 * Read release metadata from storage.
	 * 
	 * @param metaURI Metadata URI.
	 */
	readReleaseMeta(metaURI: string): Promise<ReleaseMeta>;

	/**
	 * Write team metadata to storage and return its URI.
	 * 
	 * @param team Team metadata.
	 */
	writeTeamMeta(team: TeamMeta): Promise<string>;

	/**
	 * Write project metadata to storage and return its URI.
	 * 
	 * @param project Project metadata.
	 */
	writeProjectMeta(project: ProjectMeta): Promise<string>;

	/**
	 * Write release metadata to storage and return its URI.
	 * 
	 * @param release Release metadata.
	 */
	writeReleaseMeta(release: ReleaseMeta): Promise<string>;

	/**
	 * Write JSON to storage and return its URI.
	 * 
	 * @param data JSON data to write
	 */
	writeJSON(data: string): Promise<string>;

	/**
	 * Write file contents to storage and return its URI.
	 * 
	 * @param data File to write
	 */
	writeFile(data: File): Promise<string>;

	/**
	 * Read data from storage.
	 * 
	 * @param uri URI of data.
	 */
	read(uri: string): Promise<string>;
}

export { IPFS };