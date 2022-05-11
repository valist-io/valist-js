import { Command } from '@oclif/core'
import keytar from 'keytar'
import { ethers } from 'ethers'

export default class Import extends Command {
  static description = 'Import a private key'

  static examples = [
    '<%= config.bin %> <%= command.id %> 0xDEADBEEF',
  ]

  static args = [
    {
      name: 'private-key',
      required: true,
      description: 'private key',
    },
  ]

  public async run(): Promise<void> {
    const { args } = await this.parse(Import);
    const wallet = new ethers.Wallet(args['private-key']);
    await keytar.setPassword('VALIST', wallet.address, wallet.privateKey);
    this.log(`successfully imported ${wallet.address}`);
  }
}
