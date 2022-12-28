// adapted from OZ Defender Workshop https://github.com/OpenZeppelin/workshops/blob/9402515b42efe1b4b3c5d8621fc78b55e7078386/25-defender-metatx-api/src/signer.js
import { ethers, PopulatedTransaction } from "ethers";
import axios from "axios";

const ForwarderABI = [{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"execute","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"gas","type":"uint256"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct MinimalForwarder.ForwardRequest","name":"req","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"verify","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}];

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
    137: 'https://api.defender.openzeppelin.com/autotasks/3342ffa2-940e-498c-ba8b-691759c9e716/runs/webhook/c46f91ee-4fb7-43e6-8254-44f996d6a553/Y3cZWv8WcM8YpxzKaKHxKC',
  }
  return addressMap[chainId];
};

export const getMetaTxTypeData = (chainId: number, verifyingContract: string) => {
  return {
    types: {
      EIP712Domain,
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

export const signTypedData = async (signer: any, from: string, data: any) => {
  const isHardhat = data.domain.chainId == 31337;
  const [method, argData] = isHardhat
    ? ['eth_signTypedData', data]
    : ['eth_signTypedData_v4', JSON.stringify(data)]
  return await signer.send(method, [from, argData]);
};

export const buildRequest = async (forwarder: any, input: any) => {
  const nonce = await forwarder.getNonce(input.from).then((nonce: number) => nonce.toString());
  return { value: 0, gas: 1e6, nonce, ...input };
};

export const buildTypedData = async (forwarder: any, request: any) => {
  const chainId = await forwarder.provider.getNetwork().then((n: any) => n.chainId);
  const typeData = getMetaTxTypeData(chainId, forwarder.address);
  return { ...typeData, message: request };
};

export const signMetaTxRequest = async (signer: ethers.providers.Web3Provider, forwarder: ethers.Contract, input: PopulatedTransaction) => {
  const request = await buildRequest(forwarder, input);
  const toSign = await buildTypedData(forwarder, request);
  const signature = await signTypedData(signer, input.from as string, toSign);

  return { signature, request };
};

export const sendTx = async (provider: ethers.providers.Web3Provider, unsigned: PopulatedTransaction): Promise<string> => {
  unsigned.gasLimit = await provider.estimateGas(unsigned);
  unsigned.gasPrice = await provider.getGasPrice();

  const gasLimit = unsigned.gasLimit?.toHexString();
  const gasPrice = unsigned.gasPrice?.toHexString();
  const value = unsigned.value ? unsigned.value.toHexString() : '0x0';

  const txResp = await provider.send('eth_sendTransaction', [{ ...unsigned, gasLimit, gasPrice, value }]);
  return txResp.hash;
};

export const sendMetaTx = async (provider: ethers.providers.Web3Provider, unsigned: PopulatedTransaction) => {
  const chainId = (await provider.getNetwork()).chainId;
  const forwarderAddress = getForwarderContract(chainId);
  const forwarder = new ethers.Contract(forwarderAddress, ForwarderABI, provider);

  const request = await signMetaTxRequest(provider, forwarder, unsigned);

  const req = await axios.post(getAutotaskURL(chainId), JSON.stringify(request), { headers: { 'Content-Type': 'application/json' } });

  return JSON.parse(req.data.result)['txHash'];
};
4