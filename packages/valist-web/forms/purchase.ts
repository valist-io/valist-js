import { ApolloCache } from '@apollo/client';
import { Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';

export async function purchaseProduct(
  address: string | undefined,
  projectId: string,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = await valist.purchaseProduct(projectId, address);
    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));

    return true;
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}