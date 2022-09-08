import { ethers } from 'ethers';

export const tokens = [
  {
    "address": "0x0000000000000000000000000000000000000000",
    "name": "MATIC",
    "symbol": "MATIC",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/info/logo.png",
  },
  {
    "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    "name": "Wrapped Ether",
    "symbol": "WETH",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/logo.png",
  },
  {
    "address": "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    "name": "Wrapped MATIC",
    "symbol": "WMATIC",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png",
  },
  {
    "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    "name": "USD Coin (PoS)",
    "symbol": "USDC",
    "decimals": 6,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/logo.png",
  },
  {
    "address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    "name": "(PoS) Tether USD",
    "symbol": "USDT",
    "decimals": 6,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0xc2132D05D31c914a87C6611C10748AEb04B58e8F/logo.png",
  },
  {
    "address": "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    "name": "(PoS) Dai Stablecoin",
    "symbol": "DAI",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063/logo.png",
  },
  {
    "address": "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    "name": "ChainLink Token",
    "symbol": "LINK",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39/logo.png",
  },
  {
    "address": "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
    "name": "QuickSwap",
    "symbol": "QUICK",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0x831753DD7087CaC61aB5644b308642cc1c33Dc13/logo.png",
  },
  {
    "address": "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    "name": "Aave (PoS)",
    "symbol": "AAVE",
    "decimals": 18,
    "logoURI": "https://assets-cdn.trustwallet.com/blockchains/polygon/assets/0xD6DF932A45C0f255f85145f286eA0b292B21C90B/logo.png",
  },
];

export function findToken(address: string) {
  return tokens.find((token: any) => 
    token.address.toLowerCase() === address.toLowerCase(),
  );
}

export function getTokenLogo(address: string) {
  const token = findToken(address);
  return token?.logoURI ?? '';
}

export function getTokenSymbol(address: string) {
  const token = findToken(address);
  return token?.symbol ?? '';
}

export function formatUnits(address: string, value: string) {
  const token = findToken(address);
  const decimals = token?.decimals ?? 18;
  return parseFloat(ethers.utils.formatUnits(value, decimals));
}

export function parseUnits(address: string, value: string) {
  const token = findToken(address);
  const decimals = token?.decimals ?? 18;
  return ethers.utils.parseUnits(value, decimals);
}
