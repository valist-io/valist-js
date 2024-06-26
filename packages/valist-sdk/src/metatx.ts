// adapted from OZ Defender Workshop https://github.com/OpenZeppelin/workshops/blob/9402515b42efe1b4b3c5d8621fc78b55e7078386/25-defender-metatx-api/src/signer.js
import { Contract, ethers } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import axios from "axios";
import { delay } from "./utils";

type Signer = ethers.Signer & TypedDataSigner;

const ForwarderABI = [{ "inputs": [{ "components": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "gas", "type": "uint256" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MinimalForwarder.ForwardRequest", "name": "req", "type": "tuple" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "execute", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }], "name": "getNonce", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }, { "internalType": "uint256", "name": "gas", "type": "uint256" }, { "internalType": "uint256", "name": "nonce", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "internalType": "struct MinimalForwarder.ForwardRequest", "name": "req", "type": "tuple" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "verify", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }];

const EIP712Domain = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' }
];

const ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'gas', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'data', type: 'bytes' },
];

const getForwarderContract = (chainId: number) => {
  const addressMap: Record<number, string> = {
    80001: '0xe111Cd016Fd7c4E9FFF0670e22d2a01948B5b58E',
    137: '0x2abeE2E2294556ebe0B15b8eb0ed4891b27AE777',
  };
  return addressMap[chainId];
};

const getAutotaskURL = (chainId: number) => {
  const addressMap: Record<number, string> = {
    80001: 'https://api.defender.openzeppelin.com/autotasks/45a953df-acc7-4e75-bc9a-aaf799c58fcf/runs/webhook/c46f91ee-4fb7-43e6-8254-44f996d6a553/Jju58XYcUYbXhdFQwCkjFJ',
    137: 'https://api.defender.openzeppelin.com/actions/a7a907f3-8f7b-4924-a8b3-66d271ed22f6/runs/webhook/c46f91ee-4fb7-43e6-8254-44f996d6a553/8NVQBnqyuHUPamnvnEqhkV',
  }
  return addressMap[chainId];
};

export const getMetaTxTypeData = (chainId: number, verifyingContract: string) => {
  return {
    types: {
      ForwardRequest,
    },
    domain: {
      name: 'MinimalForwarder',
      version: '0.0.1',
      chainId,
      verifyingContract,
    },
    primaryType: 'ForwardRequest',
  }
};

export const buildRequest = async (forwarder: ethers.Contract, input: ethers.ContractTransaction, signer: Signer) => {
  const nonce = await forwarder.getNonce(input.from).then((nonce: number) => nonce.toString());
  if (!nonce) throw ('unable to get none');

  const gasLimit = await signer.estimateGas(input);
  return { ...input, gas: gasLimit, value: BigInt(0), nonce: Number(nonce) };
};

export const buildTypedData = async (forwarder: ethers.Contract, request: ethers.ContractTransaction) => {
  const forwarderAddress = await forwarder.getAddress();
  const typeData = getMetaTxTypeData(137, forwarderAddress);
  return { ...typeData, message: request };
};

export const signMetaTxRequest = async (signer: Signer, forwarder: ethers.Contract, input: ethers.ContractTransaction) => {
  const request = await buildRequest(forwarder, input, signer);
  const { domain, types, message } = await buildTypedData(forwarder, request);

  let signature = await signer.signTypedData(domain, types, message);

  // Workaround for Ledger support
  let v: string | number = `0x${signature?.slice(130, 132)}`;
  v = parseInt(v, 16);
  if (![27, 28].includes(v)) {
    v += 27;
    v = v.toString(16);
    signature = `${signature?.substring(0, 130)}${v}`;
  }

  return { signature, request };
};

export const sendTx = async (signer: ethers.Signer, unsigned: ethers.ContractTransaction): Promise<string> => {
  unsigned.gasLimit = await signer.estimateGas(unsigned);
  const provider = signer?.provider;
  if (!provider) throw ('no provider found in signer');

  const gasPrice = (await provider.getFeeData()).gasPrice;
  if (!gasPrice) throw ('unable to get gas price');
  unsigned.gasPrice = gasPrice;

  const gasLimit = unsigned.gasLimit;
  const value = unsigned.value ? unsigned.value.toString(16) : '0x0';

  const { hash } = await signer.sendTransaction({ ...unsigned, gasLimit, gasPrice, value });

  return hash;
};

export const sendMetaTx = async (signer: ethers.Signer, unsigned: ethers.ContractTransaction) => {
  const provider = signer?.provider;
  if (!provider) throw ('no provider found in signer');

  const forwarderAddress = getForwarderContract(137);
  const forwarder = new ethers.Contract(forwarderAddress, ForwarderABI, signer);

  let request;

  do {
    try {
      request = await signMetaTxRequest(signer as Signer, forwarder, unsigned);
    } catch (e) {
      if (JSON.stringify(e).includes('getNonce')) {
        console.error(e);
        await delay(250);
      } else {
        throw new Error(e);
      }
    }
  } while (request == null);

  const req = await axios.post(getAutotaskURL(137), JSON.stringify(request), { headers: { 'Content-Type': 'application/json' } });

  return JSON.parse(req.data.result)['txHash'];
};

// @ts-expect-error 🚧 ETHERS 6 IS STILL BROKEN IN NEXTJS. THIS IS A WORKAROUND
BigInt.prototype.toJSON = function () {
  return this.toString()
}
