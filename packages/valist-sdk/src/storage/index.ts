import { TeamMeta, ProjectMeta, ReleaseMeta, LicenseMeta } from '../index';
import { IPFS } from './ipfs';
import { Pinata } from './pinata';

/**
 * Storage abstraction API.
 */
export interface StorageAPI {
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
	 * Write folder contents to storage and return its URI.
	 * 
	 * @param data Folder to write
	 */
	writeFolder(data: File[]): Promise<string>;
}

export { IPFS, Pinata };