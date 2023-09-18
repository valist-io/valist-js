import { ethers } from 'ethers';
import axios from 'axios';
import { filesFromPaths } from './files';
import { webcrypto } from 'node:crypto';

const createHash = async (text: string) => {
  const utf8 = new TextEncoder().encode(text);
  const hashBuffer = await (globalThis.crypto || webcrypto).subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

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

export const getFilesFromPath = filesFromPaths;

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

export async function generateValistToken(apiSecret: string, expiresIn: number = 3600): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + expiresIn; // defaults to 60min

  const hashInput = `${apiSecret}${expires}`;
  const hash = await createHash(hashInput);

  const token = `${hash}${expires}`;
  return token;
}

export async function verifyValistToken(apiSecret: string, token: string): Promise<boolean> {
  const requestHash = token.slice(0, 64);
  const expires = token.slice(64, 82);

  if (new Date(expires) < new Date()) return false;

  const hashInput = `${apiSecret}${expires}`;
  const hash = await createHash(hashInput);

  return requestHash === hash;
}
