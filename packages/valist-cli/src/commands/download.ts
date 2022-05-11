import { Command, CliUx } from '@oclif/core';
import { create } from '@valist/sdk';
import { create as createIPFS } from 'ipfs-http-client';
import { ethers } from 'ethers';
import * as flags from '../flags';
import * as path from 'node:path';
import * as fs from 'node:fs';

export default class Download extends Command {
  static description = 'Download a package.'

  static examples = [
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.2',
    '<%= config.bin %> <%= command.id %> ipfs/go-ipfs/v0.12.2 ~/Downloads/',
  ]

  static args = [
    {
      name: 'package',
      required: true,
      description: 'package name',
    },
    {
      name: 'output',
      default: '',
      description: 'output path',
    },
  ]

  static flags = {
    network: flags.network,
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Download);

    const parts = args.package.split('/');
    if (parts.length !== 3) {
      this.error('invalid package name');
    }

    const provider = new ethers.providers.JsonRpcProvider(flags.network);
    const valist = await create(provider, {metaTx: true});
    const ipfs = createIPFS({url: 'https://pin.valist.io'});

    const {chainId} = await provider.getNetwork();
    const accountID = valist.generateID(chainId, parts[0]);
    const projectID = valist.generateID(accountID, parts[1]);
    const releaseID = valist.generateID(projectID, parts[2]);

    CliUx.ux.action.start('fetching package metadata');
    const release = await valist.getReleaseMeta(releaseID);
    CliUx.ux.action.stop();

    if (!release.external_url) {
      this.error('invalid release url');
    }

    const ipfsIndex = release.external_url.indexOf('/ipfs/');
    const ipfsPath = release.external_url.slice(ipfsIndex);

    const filePath = path.join(args.output, `${parts[1]}.tar`);
    const fileStream = fs.createWriteStream(filePath, {flags: 'wx'});

    CliUx.ux.action.start('fetching package contents');
    for await (const buffer of ipfs.get(ipfsPath)) {
      fileStream.write(buffer);
    }
    CliUx.ux.action.stop();

    this.log(`package downloaded to ${path.resolve(filePath)}`);
  }
}
