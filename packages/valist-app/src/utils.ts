import { 
  Block,
  BlockWithTransactions,
  TransactionResponse,
  TransactionReceipt, 
} from '@ethersproject/abstract-provider';

export function formatBlock(block?: Block | BlockWithTransactions) {
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

export function formatTransaction(tx?: TransactionResponse) {
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

export function formatReceipt(rcpt?: TransactionReceipt) {
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