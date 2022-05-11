import { Flags } from '@oclif/core';
import keytar from 'keytar';
import * as inquirer from 'inquirer';

export const privateKey = Flags.string({
  description: 'Account private key',
  env: 'VALIST_PRIVATE_KEY',
  default: defaultAccount,
})

export const network = Flags.string({
  description: 'Blockchain network',
  env: 'VALIST_NETWORK',
  default: 'https://rpc.valist.io/polygon',
  parse: parseNetwork,
})

async function parseNetwork(network: string) {
  switch (network) {
  case 'polygon':
    return 'https://rpc.valist.io/polygon';
  case 'mumbai':
    return 'https://rpc.valist.io/mumbai';
  default:
    return network;
  }
}

async function defaultAccount() {
  const credentials = await keytar.findCredentials('VALIST')
  if (credentials.length === 0) {
    throw new Error('no accounts found. use import to add an account.')
  }

  const choices = credentials.map((c: any) => ({
    name: c.account,
    value: c.password,
  }))

  const {account} = await inquirer.prompt([{
    name: 'account',
    message: 'select an account',
    type: 'list',
    choices: choices,
  }])

  return account
}