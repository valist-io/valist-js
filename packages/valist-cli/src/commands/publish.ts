import { Command, CliUx } from '@oclif/core';
import { ethers } from 'ethers';
import { create, ReleaseMeta, Provider } from '@valist/sdk';
import * as flags from '../flags';
import { select } from '../keys';
import glob from '../glob';

const Web3HttpProvider = require('web3-providers-http'); // eslint-disable-line @typescript-eslint/no-var-requires

export default class Publish extends Command {
  static provider?: Provider

  static description = 'Publish a release'

  static strict = false

  static examples = [
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.3 README.md',
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.3 dist/** docs/**',
  ]

  static flags = {
    'meta-tx': flags.metaTx,
    'network': flags.network,
    'private-key': flags.privateKey,
  }

  static args = [
    {
      name: 'package',
      required: true,
      description: 'package name',
    },
    {
      name: 'files',
      required: true,
      description: 'files to publish',
    },
  ]

  async provider(network: string): Promise<Provider> {
    if (Publish.provider) return Publish.provider;
    const provider = new Web3HttpProvider(network);
    return new ethers.providers.Web3Provider(provider);
  }

  public async run(): Promise<void> {
    const { args, argv, flags } = await this.parse(Publish);

    const parts = args.package.split('/');
    if (parts.length !== 3) {
      this.error('invalid package name');
    }

    const privateKey = flags['private-key'] || await select();
    const metaTx = flags['meta-tx'];

    const provider = await this.provider(flags.network);
    const wallet = new ethers.Wallet(privateKey);
    const valist = await create(provider, { metaTx, wallet });

    const { chainId } = await provider.getNetwork();
    const accountID = valist.generateID(chainId, parts[0]);
    const projectID = valist.generateID(accountID, parts[1]);
    const releaseID = valist.generateID(projectID, parts[2]);

    const isAccountMember = await valist.isAccountMember(accountID, wallet.address);
    const isProjectMember = await valist.isProjectMember(projectID, wallet.address);
    if (!(isAccountMember || isProjectMember)) {
      this.error('user is not an account or project member')
    }

    const releaseExists = await valist.releaseExists(releaseID);
    if (releaseExists) {
      this.error(`release ${parts[2]} exists`)
    }

    CliUx.ux.action.start('uploading files');
    const metaURI = await valist.writeFolder(glob(argv.slice(1)));
    CliUx.ux.action.stop();

    const release = new ReleaseMeta();
    release.name = parts[2];
    release.external_url = metaURI;
    release.image = '';
    release.description = '';

    CliUx.ux.action.start('publishing release');
    const tx = await valist.createRelease(projectID, parts[2], release);
    CliUx.ux.action.stop();

    CliUx.ux.action.start(`confirming transaction ${tx.hash}`);
    await tx.wait();
    CliUx.ux.action.stop();
  }
}
