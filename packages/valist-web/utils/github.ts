import { Octokit } from "@octokit/core";
import { randomBytes } from "crypto";
import { ethers } from "ethers";
import libsodium from 'libsodium-wrappers';

export type ProjectType = 'next' | 'go' | 'custom';

export const distLocation: Record<ProjectType, string> = {
  next: 'out',
  go: 'dist',
  custom: '',
};

export const PR_TITLE = "Add Valist GitHub Action";

export const author = {
  name: 'Valist Bot',
  email: 'hello@valist.io',
};

export const buildSteps: Record<ProjectType, string> = {
  next: `
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '16'

      - name: Build and export Next.js app
        run: |
          npm install
          npm run build
          npx next export`,
  go: `
      - name: Setup Go
        uses: actions/setup-go@v3
        with:
          go-version: '^1.13.1'
      
      - name: Build Go Project
        run: |
          GOOS=windows GOARCH=amd64 go build -o ./dist/windows-amd64 src/main.go
          GOOS=linux GOARCH=amd64 go build -o ./dist/linux-amd64 src/main.go
          GOOS=darwin GOARCH=amd64 go build -o ./dist/darwin-amd64 src/main.go
          GOOS=darwin GOARCH=arm64 go build -o ./dist/darwin-arm64 src/main.go`,
  custom: '',
};

export function getBuildStep(projectType: ProjectType): string {
  const buildStep = buildSteps[projectType];
  if (buildStep) return buildStep;
  return buildSteps['custom'];
};

export async function getRepoPubicKey(octokit: Octokit, owner: string, repo: string) {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
    owner: owner,
    repo: repo,
  });
};

export async function checkRepoSecret(octokit: Octokit, owner: string, repo: string) {
  try {
    await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner,
      repo,
      secret_name: 'VALIST_SIGNER',
    });
  } catch (err) {
    return false;
  }
  return true;
};

export async function getRepos(octokit: Octokit) {
  return await octokit.request('GET /user/repos', { per_page: 100 });
};

export async function getWorkflows(octokit: Octokit, owner: string, repo: string) {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
    owner,
    repo,
    per_page: 1000,
  });
}

function assertDefined<T>(value: T | undefined | null, msg = "value was undefined or null"): T {
  if (value == undefined || value == null) {
    throw new Error(msg);
  }
  return value;
}

export async function mergePr(octokit: Octokit, owner: string, repo: string) {
  const prs = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    per_page: 1000,
  });

  const pull_number = Number.parseInt(assertDefined(
    prs.data
      .map(pr => pr.title)
      .filter(title => title == PR_TITLE)[0],
    "No PR exists",
  ));

  return await octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
    owner,
    repo,
    pull_number,
    commit_title: 'Merge Valist',
    commit_message: 'Add valist workflow file',
  });
};

export function buildYaml(account: string = '', project: string = '', projectType: ProjectType) {
  // Get path to artifacts from ProjectType
  const path = distLocation[projectType];

  const privateKey = '${{ secrets.VALIST_SIGNER }}';
  const release = '${{ env.TIMESTAMP }}';
  return `name: Valist Publish
on:
  push:
    branches:
      - main
jobs:
  valist-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      ${getBuildStep(projectType)}

      - name: Mark Timestamp
        run: echo "TIMESTAMP=$(date +%Y%m%d%H%M)" >> $GITHUB_ENV
        
      - name: Valist Publish
        uses: valist-io/valist-github-action@v2.3.1
        with:
          private-key: ${privateKey}
          account: webgame
          project: game
          release: ${release}
          path: ${path}
`;
};

export const getCurrentCommit = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string = 'main',
) => {
  const refData = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
    owner: owner,
    repo: repo,
    ref: `heads/${branch}`,
  });
  const commitSha = refData.data.object.sha;

  const commitData = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
    owner,
    repo,
    commit_sha: commitSha,
  });

  return {
    commitSha,
    treeSha: commitData?.data?.tree.sha,
  };
};

export async function createPullRequest(octokit: Octokit, valistConfig: string, owner: string, repo: string) {
  // Get current commit
  const currentCommit = await getCurrentCommit(octokit, owner, repo);
  console.log('Current Commit', currentCommit);

  // Upload file blob
  const fileBlob = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
    owner,
    repo,
    content: valistConfig,
    encoding: 'utf-8',
  });
  const fileBlobSHA = fileBlob.data.sha;
  console.log('fileBlobSHA', fileBlobSHA);

  // Create new file tree for branch
  const newTree = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
    owner,
    repo,
    base_tree: currentCommit.treeSha,
    tree: [
      {
        path: '.github/workflows/valist.yml',
        mode: '100644',
        type: 'blob',
        sha: fileBlobSHA,
      },
    ],
  });

  const newTreeSHA = newTree.data.sha;
  console.log('new tree sha', newTreeSHA);

  // Create a new commit
  const commit = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
    owner,
    repo,
    message: 'Add Valist publish workflow',
    author,
    committer: author,
    parents: [
      currentCommit.commitSha,
    ],
    tree: newTreeSHA,
  });
  const commitSHA = commit.data.sha;
  console.log('commit sha', commitSHA);

  // Create a branch
  const branch = await octokit.request('POST /repos/{owner}/{repo}/git/refs', {
    owner,
    repo,
    ref: 'refs/heads/feature/valist',
    sha: commitSHA,
  });
  console.log('branch', branch);

  // Create a pull request
  const pullRequest = await octokit.request('POST /repos/{owner}/{repo}/pulls', {
    owner,
    repo,
    title: PR_TITLE,
    body: 'Adds valist publish to CI/CD pipeline!',
    head: 'feature/valist',
    base: 'main',
  });
  console.log('pull request', pullRequest);
};

export async function addSecret(octokit: Octokit, owner: string, repo: string) {
  const key = await getRepoPubicKey(octokit, owner, repo);

  const signer_key = randomBytes(32).toString('hex');
  const wallet = new ethers.Wallet(signer_key);

  // Convert the message and key to Uint8Array's (Buffer implements that interface)
  const messageBytes = Buffer.from(wallet.privateKey);
  const keyBytes = Buffer.from(key?.data?.key, 'base64');

  // Encrypt using LibSodium.
  await libsodium.ready;
  const encryptedBytes = libsodium.crypto_box_seal(messageBytes, keyBytes);

  // Base64 the encrypted secret
  const encrypted = Buffer.from(encryptedBytes).toString('base64');

  await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
    owner: owner,
    repo: repo,
    secret_name: 'VALIST_SIGNER',
    encrypted_value: encrypted,
    key_id: key?.data?.key_id,
  });

  return wallet?.publicKey;
};