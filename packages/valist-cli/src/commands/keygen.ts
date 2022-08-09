import { Command } from '@oclif/core';
import keytar from 'keytar';
import { ethers } from 'ethers';
import { randomBytes } from 'crypto';

export default class Keygen extends Command {
  static alias = ['gen'];

  static description = 'Generate a new account';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  async createSignerKey(): Promise<ethers.Wallet> {
    const key = randomBytes(32).toString('hex');
    return new ethers.Wallet(key);
  }

  public async run(): Promise<void> {
    const wallet = await this.createSignerKey();
    await keytar.setPassword('VALIST', wallet.address, wallet.privateKey);
    this.log(`successfully generated ${wallet.address}`);
  }
}
