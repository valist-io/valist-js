import { Octokit } from "@octokit/core";
import { randomBytes } from "crypto";
import { ethers } from "ethers";
import libsodium from 'libsodium-wrappers';

export const PR_TITLE = "Add Valist GitHub Action";

export const author = {
  name: 'Valist Bot',
  email: 'hello@valist.io',
};

export type CreateFunction = (value: Record<string, string>) => string;
export type WebEnvironment = 'node16';
export type WebFramework = 'next' | 'react' | 'other';
export type PublishingMethod = 'valist';

export type WebFrameworkDefault = {
  installCommand: string;
  buildCommand: string;
  outputFolder: string;
}

export const webFrameworkDefaults: Record<WebFramework, WebFrameworkDefault> = {
  next: {
    outputFolder: 'out',
    buildCommand: 'npm run build && npx next export',
    installCommand: 'npm install',
  },
  react: {
    outputFolder: 'build',
    buildCommand: 'npm run build',
    installCommand: 'npm install',
  },
  other: {
    outputFolder: 'dist',
    buildCommand: 'npm run build',
    installCommand: 'npm install',
  },
};

// create functions for webEnvironments
export const webEnvironments: Record<WebEnvironment, CreateFunction> = {
  node16: ({ }) => `
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '16' \n`,
};

export const webFrameworks: Record<WebFramework, CreateFunction> = {
  next: ({ buildCommand, installCommand }) => `
      - name: Build and export Next.js app
        run: |${installCommand ? '\n          ' + installCommand : ''}
          ${buildCommand}
\n`,
  react: ({ buildCommand, installCommand }) => `
      - name: Build and export Create React App
        run: |${installCommand ? '\n          ' + installCommand : ''}
          ${buildCommand}
\n`,
  other: ({ buildCommand, installCommand }) => `
      - name: Build and export Javascript App
        run: |${installCommand ? '\n          ' + installCommand : ''}
          ${buildCommand}
\n`,
};

export const publishingMethod: Record<PublishingMethod, CreateFunction> = {
  valist: ({ account, project, outputPath }) => {
    const privateKey = '${{ secrets.VALIST_SIGNER }}';
    const release = '${{ env.TIMESTAMP }}';
    return `      - name: Mark Timestamp
        run: echo "TIMESTAMP=$(date +%Y%m%d%H%M)" >> $GITHUB_ENV
        
      - name: Valist Publish
        uses: valist-io/valist-github-action@v2
        with:
          private-key: ${privateKey}
          account: ${account}
          project: ${project}
          release: ${release}
          platform-web: ${outputPath}
        `;
  },
};

export type BuildManifest = {
  build: Record<'web', Record<string, any>>;
  publish: Record<PublishingMethod, Record<string, any>>;
  integrations: Record<string, Record<string, any>>;
}

export function buildYaml(manifest: BuildManifest, branchName: string) {
  let outputPath = manifest.build.web.outputFolder;
  let yaml = `name: Valist Deploy
on:
  push:
    branches:
      - ${branchName}
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
`;

  // loop through build targets
  for (const [key, value] of Object.entries(manifest.build)) {
    if (value?.environment) {
      yaml = yaml.concat(
        // @ts-ignore Add base environment
        webEnvironments[value.environment]({}),
      );
    }

    if (value?.framework) {
      yaml = yaml.concat(
        // @ts-ignore Add build step
        webFrameworks[value.framework]({
          installCommand: value.installCommand,
          buildCommand: value.buildCommand,
        }),
      );
    }
  }

  // loop through publishing methods
  for (const [key, value] of Object.entries(manifest.publish)) {
    yaml = yaml.concat(
      // @ts-ignore Add publishing method
      publishingMethod[key]({ ...value, outputPath }),
    );
  }

  return yaml;
};

export async function getRepoPubicKey(octokit: Octokit, owner: string, repo: string) {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
    owner: owner,
    repo: repo,
  });
};

export async function getRepoSecrets(octokit: Octokit, owner: string, repo: string) {
  try {
    const result = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets', {
      owner,
      repo,
      per_page: 1000,
    });
    return result;
  } catch (err) {
    return false;
  }
};

export async function checkRepoSecret(octokit: Octokit, owner: string, repo: string) {
  try {
    await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
      owner,
      repo,
      secret_name: 'VALIST_SIGNER',
    });
  } catch (err) {
    if (String(err).includes('Resource not accessible by integration')) return 403;
    return 404;
  }
  return 200;
};

export async function getRepos(octokit: Octokit) {
  return await octokit.request('GET /user/repos', { type: 'owner', per_page: 100 });
};

export async function getWorkflows(octokit: Octokit, owner: string, repo: string) {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs', {
    owner,
    repo,
    per_page: 1000,
  });
}

export async function getJobLogs(octokit: Octokit, owner: string, repo: string, run_id: number) {
  return await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', {
    owner,
    repo,
    run_id,
  });
}

export async function getRunLogs(octokit: Octokit, owner: string, repo: string, run_id: number) {
  // return await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs', {
  //   owner,
  //   repo,
  //   run_id
  //   attempt_number: 'ATTEMPT_NUMBER'
  // })
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

export async function createPullRequest(octokit: Octokit, valistConfig: string, owner: string, repo: string, branchName: string) {
  // Get current commit
  console.log('branchName', branchName);
  const currentCommit = await getCurrentCommit(octokit, owner, repo, branchName);
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
    base: branchName,
  });
  console.log('pull request', pullRequest);
};

export async function addValistSigner(octokit: Octokit, owner: string, repo: string) {
  const wallet = new ethers.Wallet(randomBytes(32).toString('hex'));
  await addSecret(octokit, owner, repo, 'VALIST_SIGNER', wallet.privateKey);
  return wallet?.publicKey;
}

export async function addSecret(octokit: Octokit, owner: string, repo: string, secret_name: string, secret_value: string) {
  const key = await getRepoPubicKey(octokit, owner, repo);

  // Convert the message and key to Uint8Array's (Buffer implements that interface)
  const messageBytes = Buffer.from(secret_value);
  const keyBytes = Buffer.from(key?.data?.key, 'base64');

  // Encrypt using LibSodium.
  await libsodium.ready;
  const encryptedBytes = libsodium.crypto_box_seal(messageBytes, keyBytes);

  // Base64 the encrypted secret
  const encrypted = Buffer.from(encryptedBytes).toString('base64');

  await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
    owner: owner,
    repo: repo,
    secret_name: secret_name,
    encrypted_value: encrypted,
    key_id: key?.data?.key_id,
  });
};