import { ethers } from 'ethers';
import { getFilesFromPath as getFiles } from 'files-from-path';
import axios from 'axios';

/**
 * Generate account, project, and release IDs.
 * 
 * @param parentID ID of the parent account or release. Use chainId for accounts.
 * @param name Name of the account, project, or rlease.
 */
export function generateID(parentID: ethers.BigNumberish, name: string): string {
	const nameBytes = ethers.utils.toUtf8Bytes(name);
	const nameHash = ethers.utils.keccak256(nameBytes);
	return ethers.utils.solidityKeccak256(["uint256", "bytes32"], [parentID, nameHash]);
}

export function getAccountID(chainId: ethers.BigNumberish, account: string): string {
	return generateID(chainId, account);
}

export function getProjectID(chainId: ethers.BigNumberish, account: string, project: string): string {
	return generateID(generateID(chainId, account), project);
}

export function getReleaseID(chainId: ethers.BigNumberish, account: string, project: string, release: string): string {
	return generateID(generateID(generateID(chainId, account), project), release);
}

export const getFilesFromPath = getFiles;

/**
 * Convert the passed file to an "import candidate" - an object suitable for
 * passing to the ipfs-unixfs-importer. Note: content is an accessor so that
 * the stream is only created when needed.
 *
 * @param {Filelike} file
 */
export const toImportCandidate = (file: File) => {
	/** @type {ReadableStream} */
	let stream: any;
	return {
		path: file.name,
		get content() {
			stream = stream || file.stream()
			return stream
		}
	}
}

// thanks to https://stackoverflow.com/a/39906526
export const formatBytes = (x: string) => {
	const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	let l = 0, n = parseInt(x, 10) || 0;

	while (n >= 1024 && ++l) {
		n = n / 1024;
	}
	
	return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

export async function getStats(projectPath: string): Promise<number | undefined> {
	const stats = await axios.get(
		`https://stats.valist.io/api/downloads/${projectPath}`,
	);

	if (stats?.data?.downloads) return Number(stats?.data?.downloads);
}

export async function sendStats(projectPath: string) {
	await axios.put(
		`https://stats.valist.io/api/download/${projectPath}`
	);
}

export const delay = (time: number) => {
	return new Promise(resolve => setTimeout(resolve, time));
}