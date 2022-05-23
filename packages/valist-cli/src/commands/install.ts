import { Command, CliUx } from '@oclif/core';
import { create, Provider, InstallMeta } from '@valist/sdk';
import { create as createIPFS } from 'ipfs-http-client';
import { ethers } from 'ethers';
import * as flags from '../flags';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

export default class Install extends Command {
  static provider?: Provider

  static description = 'Install a package'

  static examples = [
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.2',
  ]

  static flags = {
    'network': flags.network,
  }

  static args = [
    {
      name: 'package',
      required: true,
      description: 'package name',
    }
  ]

  async provider(network: string): Promise<Provider> {
    if (Install.provider) return Install.provider;
    return new ethers.providers.JsonRpcProvider(network);
  }

  getInstallPath(install: InstallMeta) {
    const platformArch = `${process.platform}/${process.arch}`;
    switch (platformArch) {
      case 'darwin/arm64':
        return install.darwin_arm64;
      case 'darwin/x64':
        return install.darwin_amd64;
      case 'win32/ia32':
        return install.windows_386;
      case 'win32/x64':
        return install.windows_amd64;
      case 'linux/ia32':
        return install.linux_386;
      case 'linux/x64':
        return install.linux_amd64;
      case 'linux/arm':
        return install.linux_arm;
      case 'linux/arm64':
        return install.linux_arm64;
    }
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Install);

    const parts = args.package.split('/');
    if (parts.length < 2 && parts.length > 3) {
      this.error('invalid package name');
    }

    const provider = await this.provider(flags.network);
    const valist = await create(provider, { metaTx: false });
    const ipfs = createIPFS({ url: 'https://pin.valist.io' });

    const {chainId} = await provider.getNetwork();
    const accountID = valist.generateID(chainId, parts[0]);
    const projectID = valist.generateID(accountID, parts[1]);
    const releaseID = parts.length === 2
      ? await valist.getLatestReleaseID(projectID) 
      : valist.generateID(projectID, parts[2]);

    CliUx.ux.action.start('fetching package metadata');
    const release = await valist.getReleaseMeta(releaseID);
    CliUx.ux.action.stop();

    if (!release.external_url) {
      this.error('invalid release url');
    }
    if (!release.install) {
      this.error('package is not installable');
    }

    const ipfsIndex = release.external_url.indexOf('/ipfs/');
    const ipfsPath = release.external_url.slice(ipfsIndex);

    const installPath = this.getInstallPath(release.install);
    if (!installPath) {
      this.error('unsupported platform/arch');
    }

    const valistDir = path.join(os.homedir(), 'valist', 'bin');
    await fs.promises.mkdir(valistDir, { recursive: true });

    const filePath = path.join(valistDir, release.install.name ?? parts[1]);
    const fileStream = fs.createWriteStream(filePath, { flags: 'w' });

    CliUx.ux.action.start('fetching package contents');
    const downloadPath = path.posix.join(ipfsPath, installPath);
    for await (const buffer of ipfs.cat(downloadPath)) {
      fileStream.write(buffer);
    }
    CliUx.ux.action.stop();

    await fs.promises.chmod(filePath, 755);
    this.log(`package installed to ${filePath}`);
  }
}
