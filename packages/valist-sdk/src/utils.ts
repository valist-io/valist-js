import { ethers } from 'ethers';
import { urlSource } from 'ipfs-http-client';
import { getFilesFromPath as getFiles, File as NodeFile } from 'web3.storage';

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
export const File = NodeFile;