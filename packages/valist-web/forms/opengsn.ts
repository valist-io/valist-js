import { Signer, BigNumber } from 'ethers';
import * as utils from './utils';

export const paymasterAddress = '0x137F8009fc7795dD8a004fdb38852F54368194e8';

export const paymasterABI = `[{
  "inputs": [],
  "name": "getRelayHubDeposit",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]`;

export async function deposit(
  value: BigNumber,
  signer: Signer | undefined | null,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!signer) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    await signer.sendTransaction({ to: paymasterAddress, value });

    return true;
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}