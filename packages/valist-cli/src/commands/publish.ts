import { Command, CliUx, Flags } from '@oclif/core';
import { ethers } from 'ethers';
import { create, ReleaseMeta, Provider, getFilesFromPath } from '@valist/sdk';
import YAML from 'yaml';
import * as fs from 'node:fs';
import * as flags from '../flags';
import { select } from '../keys';
import Config from '../config';

const Web3HttpProvider = require('web3-providers-http'); // eslint-disable-line @typescript-eslint/no-var-requires

export default class Publish extends Command {
  static provider?: Provider

  static description = 'Publish a release'

  static examples = [
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.3 README.md',
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.3 dist/** docs/**',
  ]

  static flags = {
    'meta-tx': flags.metaTx,
    'network': flags.network,
    'private-key': flags.privateKey,
    'include-dot-files': Flags.boolean({
      description: 'Include hidden dot files',
      default: false,
    }),
  }

  static args = [
    {
      name: 'package',
      description: 'package name',
    },
    {
      name: 'path',
      description: 'path to artifact file or directory',
    },
  ]

  async provider(network: string): Promise<Provider> {
    if (Publish.provider) return Publish.provider;
    const provider = new Web3HttpProvider(network);
    return new ethers.providers.Web3Provider(provider);
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Publish);

    let config: Config;
    if (args.package) {
      const parts = args.package.split('/');
      if (parts.length !== 3) this.error('invalid package name');
      config = new Config(parts[0], parts[1], parts[2], args.path);
    } else {
      const data = fs.readFileSync('valist.yml', 'utf8');
      config = YAML.parse(data);
    }

    if (!config.account) this.error('invalid account name');
    if (!config.project) this.error('invalid project name');
    if (!config.release) this.error('invalid release name');
    if (!config.path) this.error('invalid file path');

    const privateKey = flags['private-key'] || await select();
    const metaTx = flags['meta-tx'];
    const hidden = flags['include-dot-files'];

    const provider = await this.provider(flags.network);
    const wallet = new ethers.Wallet(privateKey);
    const valist = await create(provider, { metaTx, wallet });

    const { chainId } = await provider.getNetwork();
    const accountID = valist.generateID(chainId, config.account);
    const projectID = valist.generateID(accountID, config.project);
    const releaseID = valist.generateID(projectID, config.release);

    const isAccountMember = await valist.isAccountMember(accountID, wallet.address);
    const isProjectMember = await valist.isProjectMember(projectID, wallet.address);
    if (!(isAccountMember || isProjectMember)) {
      this.error('user is not an account or project member');
    }

    const releaseExists = await valist.releaseExists(releaseID);
    if (releaseExists) {
      this.error(`release ${config.release} exists`);
    }

    const release = new ReleaseMeta();
    release.name = config.release;
    release.description = config.description;
    release.install = config.install;

    CliUx.ux.action.start('uploading files');
    // upload release assets
    const artifacts = await getFilesFromPath(config.path);
    release.external_url = await valist.writeFolder(artifacts);
    
    // upload release image
    if (config.image) {
      const imageFile = await getFilesFromPath(config.image);
      release.image = await valist.writeFile(imageFile[0]);
    }
    
    // upload source snapshot
    // if (config.source) {
    //   const archiveURL = archiveSource(config.source);
    //   release.source = await valist.writeFile(archiveURL);
    // }
    CliUx.ux.action.stop();

    CliUx.ux.action.start('publishing release');
    const tx = await valist.createRelease(projectID, config.release, release);
    CliUx.ux.action.stop();

    CliUx.ux.action.start(`confirming transaction ${tx.hash}`);
    await tx.wait();
    CliUx.ux.action.stop();

    CliUx.ux.log(`successfully published ${args.package}!`);
    CliUx.ux.log(`view the release at: https://app.valist.io/${args.package}`);
  }
}
