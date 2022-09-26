import { ethers } from 'ethers';

function getProvider(chainId: number) {
  switch (chainId) {
    case 137:
      return new ethers.providers.JsonRpcProvider('https://rpc.valist.io');
    case 80001:
      return new ethers.providers.JsonRpcProvider('https://rpc.valist.io/mumbai');
    default:
      throw new Error(`unsupported network ${chainId}`);
  }
}

export class Wallet {
  wallet: ethers.Wallet;
  provider: ethers.providers.JsonRpcProvider;

  constructor() {
    this.wallet = new ethers.Wallet('');
    this.provider = getProvider(137);
  }

  private async getBlock(blockNumber: number, includeTx: boolean) {
    const block = includeTx 
      ? await this.provider.getBlockWithTransactions(blockNumber)
      : await this.provider.getBlock(blockNumber);
    if (!block) return null;

    return {
      number: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      nonce: block.nonce,
      miner: block.miner,
      difficulty: block.difficulty,
      extraData: block.extraData,
      gasLimit: block.gasLimit?.toHexString(),
      gasUsed: block.gasUsed?.toHexString(),
      timestamp: block.timestamp,
      transactions: block.transactions,
    };
  }

  private async getTransaction(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    if (!tx) return null;

    return {
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      from: tx.from,
      gas: tx.gasLimit?.toHexString(),
      gasPrice: tx.gasPrice?.toHexString(),
      hash: tx.hash,
      input: tx.data,
      nonce: tx.nonce,
      to: tx.to,
      value: tx.value?.toHexString(),
      v: tx.v,
      r: tx.r,
      s: tx.s,
    };
  }

  private async getReceipt(hash: string) {
    const rcpt = await this.provider.getTransactionReceipt(hash);
    if (!rcpt) return null;

    return {
      transactionHash: rcpt.transactionHash,
      transactionIndex: rcpt.transactionIndex,
      blockHash: rcpt.blockHash,
      blockNumber: rcpt.blockNumber,
      from: rcpt.from,
      to: rcpt.to,
      cumulativeGasUsed: rcpt.cumulativeGasUsed?.toHexString(),
      gasUsed: rcpt.gasUsed?.toHexString(),
      contractAddress: rcpt.contractAddress,
      logs: rcpt.logs,
      logsBloom: rcpt.logsBloom,
      root: rcpt.root,
      status: rcpt.status,
    };
  }

  public async request(request: { method: string, params?: Array<any> }) {
    switch (request.method) {
      case 'eth_requestAccounts':
      case 'eth_accounts': {
        return [this.wallet.address];
      }
      case 'eth_chainId':
      case 'net_version': {
        const network = await this.provider.getNetwork();
        return network.chainId;
      }
      case 'eth_call': {
        const [tx, blockTag] = request.params;
        const call = { ...tx, gasLimit: tx.gas };
        return await this.provider.call(call, blockTag);
      }
      case 'eth_getBalance': {
        const [address, blockTag] = request.params;
        const balance = await this.provider.getBalance(address, blockTag);
        return balance.toHexString();
      }
      case 'eth_blockNumber': {
        return await this.provider.getBlockNumber();
      }
      case 'eth_getTransactionCount': {
        const [address, blockTag] = request.params;
        return await this.provider.getTransactionCount(address, blockTag);
      }
      case 'eth_signTypedData_v4': {
        const [_address, payload] = request.params;
        const { primaryType, types, domain, message } = JSON.parse(payload);
        delete types['EIP712Domain'];
        return await this.wallet._signTypedData(domain, types, message);
      }
      case 'eth_gasPrice': {
        const gasPrice = await this.provider.getGasPrice();
        return gasPrice.toHexString();
      }
      case 'eth_getLogs': {
        const [filter] = request.params;
        return await this.provider.getLogs(filter);
      }
      case 'eth_estimateGas': {
        const [tx] = request.params;
        const gasLimit = await this.provider.estimateGas(tx);
        return gasLimit.toHexString();
      }
      case 'eth_getBlockByNumber': {
        const [blockNumber, includeTx] = request.params;
        return await this.getBlock(blockNumber, includeTx);
      }
      case 'eth_getTransactionReceipt': {
        const [hash] = request.params;
        return await this.getReceipt(hash);
      }
      case 'eth_getTransactionByHash': {
        const [hash] = request.params;
        return await this.getTransaction(hash);
      }
      case 'wallet_switchEthereumChain': {
        const [param] = request.params;
        const chainId = ethers.BigNumber.from(param.chainId).toNumber();
        this.provider = getProvider(chainId);
        return null;
      }
      default: {
        console.log('Failed to handle rpc request', request);
      }
    }
  }
}
