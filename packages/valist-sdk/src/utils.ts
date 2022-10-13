import { ethers } from 'ethers';
import { urlSource } from 'ipfs-http-client';
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

/**
 * Import a source archive from an external URL.
 * 
 * @param source URL with the following format:
 * - github.com/<owner>/<repo>/<ref>
 * - gitlab.com/<owner>/<repo>/<ref>
 */
export function archiveSource(source: string) {
	const [site, owner, repo, ...refs] = source.split('/');
	const ref = refs.join('/');

	let url: string | undefined;
	if (site === 'github.com') {
		url = `https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`;
	} else if (site === 'gitlab.com') {
		const id = encodeURIComponent(`${owner}/${repo}`);
		const sha = encodeURIComponent(ref);
		url = `https://gitlab.com/api/v4/projects/${id}/repository/archive?sha=${sha}`;
	}

	if (!url) {
		throw new Error('invalid source url');
	}

	return urlSource(url);
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

export async function getStats(projectPath: string) {
	const stats = await axios.get(
		`https://stats.valist.io/api/downloads/${projectPath}`,
	);

	return stats?.data?.downloads;
}

export async function sendStats(projectPath: string) {
	await axios.put(
		`https://stats.valist.io/api/download/${projectPath}`
	);
}
