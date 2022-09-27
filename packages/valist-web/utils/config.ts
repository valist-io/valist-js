import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { CHAIN_ID } = publicRuntimeConfig;

export function getChainId() {
  return parseInt(CHAIN_ID);
}

export function getSubgraphURI() {
  const chainId = getChainId();
  switch (chainId) {
    case 137:
      return 'https://api.thegraph.com/subgraphs/name/valist-io/valist';
    case 80001:
      return 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai';
  }
}