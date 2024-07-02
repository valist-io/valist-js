import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { CHAIN_ID } = publicRuntimeConfig;

export function getChainId() {
  return parseInt(CHAIN_ID);
}

export const SUBGRAPH_URL = `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_SUBGRAPH_API_KEY}/subgraphs/id/88cRsVabPiks1qmwJ1vPJVJKsWD5M3Z7nvdUSTkmA51f`;

export function getSubgraphURI() {
  const chainId = getChainId();
  switch (chainId) {
    case 137:
      return SUBGRAPH_URL;
    case 80001:
      return 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai';
  }
}

export const filterAddresses = [
  "0x173ab1bf2e409c891abaf24e2018d1647402707f",
  "0x1a903cc9e83830e63134a64574854d7222f73459",
  "0x22b8c9116930a216ffc5ddcaf668a0628dfa0d4c",
  "0x393b9443545e0b428b008b25e1cf1c96d5b8fe06",
  "0x5dc89bf6f73cfcbb7e06367ad3a189f4d582aa02",
  "0x88216b54bcaa9b9eebed2b5a4ee82e587439cfa4",
  "0x9c77790ec86e9187b2ba2aeb127daabd546859dd",
  "0xbd8c79740bf625f5054e86a2ce4e73879382f923",
  "0xd978bb2ad7d67290a1780098bbbd8b3293a315e6",
  "0xde31a8e636e1222e736ff0fe7e4e95acb0018c6e",
  "0x9e56353ef511fb4b85b8afa0cc25ffc26d3efd5c",
  "0x7972b09ee9554af5ee0b193f49de09865fa4141f",
  "0x31a7ed459fb11833a997426fd810a5502337ac75",
  "0x401a038c9f7b971d407cebeebc4d2df998c0cb1d",
  "0xd50daa26f556538562ba308dc0ed45cface885fe",
];