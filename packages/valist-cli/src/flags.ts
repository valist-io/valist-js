import { Flags } from '@oclif/core';

export const privateKey = Flags.string({
  description: 'Account private key',
  env: 'VALIST_PRIVATE_KEY',
  default: '',
})

export const network = Flags.string({
  description: 'Blockchain network',
  env: 'VALIST_NETWORK',
  default: 'https://rpc.valist.io',
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
