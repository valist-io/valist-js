import { Command, CliUx } from '@oclif/core';
import { ethers } from 'ethers';
import { create, Provider, ReleaseConfig } from '@valist/sdk';
import YAML from 'yaml';
import * as fs from 'node:fs';
import * as flags from '../flags';
import { select } from '../keys';

const Web3HttpProvider = require('web3-providers-http'); // eslint-disable-line @typescript-eslint/no-var-requires

export default class Publish extends Command {
  static provider?: Provider

  static description = 'Publish a release'

  static examples = [
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.3 README.md',
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.3 dist/',
  ]

  static flags = {
    'meta-tx': flags.metaTx,
    'network': flags.network,
    'private-key': flags.privateKey,
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

    let config: ReleaseConfig;
    if (args.package) {
      const parts = args.package.split('/');
      if (parts.length !== 3) this.error('invalid package name');
      config = new ReleaseConfig(parts[0], parts[1], parts[2]);
      config.platforms['web'] = args.path;
    } else {
      const data = fs.readFileSync('valist.yml', 'utf8');
      config = YAML.parse(data);
    }

    if (!config.account) this.error('invalid account name');
    if (!config.project) this.error('invalid project name');
    if (!config.release) this.error('invalid release name');
    if (!config.platforms) this.error('no platforms configured');

    const privateKey = flags['private-key'] || await select();
    const metaTx = flags['meta-tx'];

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

    CliUx.ux.action.start('uploading files');
    const release = await valist.uploadRelease(config);
    CliUx.ux.action.stop();

    CliUx.ux.log(`successfully uploaded files to IPFS: ${release.external_url}`);

    CliUx.ux.action.start('publishing release');
    const tx = await valist.createRelease(projectID, config.release, release);
    CliUx.ux.action.stop();

    CliUx.ux.action.start(`confirming transaction ${tx.hash}`);
    await tx.wait();
    CliUx.ux.action.stop();

    CliUx.ux.log(`successfully published ${config.account}/${config.project}/${config.release}!`);

    CliUx.ux.log(`view the release at:
    https://app.valist.io/${config.account}/${config.project}
    ${release.external_url}
    ipfs://${release.external_url.replace('https://gateway.valist.io/ipfs/', '')}
    `);
  }
}
