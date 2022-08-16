import { ApolloCache } from '@apollo/client';
import { ethers } from 'ethers';
import { Client } from '@valist/sdk';
import { handleEvent } from './events';
import * as utils from './utils';

export async function setProductRoyalty(
  address: string | undefined,
  projectId: string,
  recipient: string,
  amount: number,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = await valist.setProductRoyalty(projectId, recipient, amount);
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

export async function setProductLimit(
  address: string | undefined,
  projectId: string,
  limit: number,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = await valist.setProductLimit(projectId, limit);
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

export async function setProductPrice(
  address: string | undefined,
  projectId: string,
  token: string,
  price: string,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
  try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = token === ethers.constants.AddressZero
      ? await valist.setProductPrice(projectId, price)
      : await valist.setProductTokenPrice(token, projectId, price);
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

export async function withdrawProductBalance(
  address: string | undefined,
  projectId: string,
  token: string,
  recipient: string,
  valist: Client,
  cache: ApolloCache<any>,
): Promise<boolean | undefined> {
    try {
    utils.hideError();

    if (!address) {
      throw new Error('connect your wallet to continue');
    }

    utils.showLoading('Waiting for transaction');
    const transaction = token === ethers.constants.AddressZero
      ? await valist.withdrawProductBalance(projectId, recipient)
      : await valist.withdrawProductTokenBalance(token, projectId, recipient);
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
