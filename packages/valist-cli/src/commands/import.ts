import { Command, CliUx } from '@oclif/core';
import keytar from 'keytar';
import { ethers } from 'ethers';
import * as fs from 'node:fs';
import * as inquirer from 'inquirer';

const PRIVATE_KEY_TYPE = 'Private Key';
const JSON_WALLET_TYPE = 'JSON Wallet';
const MNEMONIC_TYPE = 'Mnemonic';

export default class Import extends Command {
  static description = 'Import an account'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  async importPrivateKey(): Promise<ethers.Wallet> {
    const privateKey = await CliUx.ux.prompt('What is the private key?');
    return new ethers.Wallet(privateKey);
  }

  async importJsonWallet(): Promise<ethers.Wallet> {
    const jsonPath = await CliUx.ux.prompt('Where is the JSON wallet located?');
    const json = await fs.promises.readFile(jsonPath, 'utf-8');
    const password = await CliUx.ux.prompt('What is the JSON wallet password?', { type: 'hide' });
    return await ethers.Wallet.fromEncryptedJson(json, password);
  }

  async importMnemonic(): Promise<ethers.Wallet> {
    const mnemonic = await CliUx.ux.prompt('What is the mnemonic phrase?');
    const path = await CliUx.ux.prompt('What is the derivation path?', { default: `m/44'/60'/0'/0/0` });
    const wordlist = await CliUx.ux.prompt('What is the wordlist language?', { default: 'en' });
    return ethers.Wallet.fromMnemonic(mnemonic, path, wordlist);
  }

  public async run(): Promise<void> {
    const { source } = await inquirer.prompt([{
      name: 'source',
      message: 'Select an import source',
      type: 'list',
      choices: [PRIVATE_KEY_TYPE, JSON_WALLET_TYPE, MNEMONIC_TYPE],
    }]);

    let wallet: ethers.Wallet;
    if (source === PRIVATE_KEY_TYPE) {
      wallet = await this.importPrivateKey();
    } else if (source === JSON_WALLET_TYPE) {
      wallet = await this.importJsonWallet();
    } else /* if (source === MNEMONIC_TYPE) */ {
      wallet = await this.importMnemonic();
    }

    await keytar.setPassword('VALIST', wallet.address, wallet.privateKey);
    this.log(`successfully imported ${wallet.address}`);
  }
}
