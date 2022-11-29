import { ApolloCache } from '@apollo/client';
import { Anchor } from "@mantine/core";
import * as utils from './utils';
import { Client, ProjectMeta } from "@valist/sdk";
import { getBlockExplorer } from '@/components/Activity';
import { handleEvent } from './events';

export async function linkRepo(
  address: string | undefined,
  projectId: string,
  projectMeta: ProjectMeta,
  repository: string,
  valist: Client,
  cache: ApolloCache<any>,
  chainId: number,
) {
  utils.hideError();

  if (!address) {
    throw new Error('connect your wallet to continue');
  }

  try {
    utils.showLoading('Creating transaction');
    const transaction = await valist.setProjectMeta(projectId, { ...projectMeta, repository });

    const message = <Anchor target="_blank"  href={getBlockExplorer(chainId, transaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(message);

    const receipt = await transaction.wait();
    receipt.events?.forEach(event => handleEvent(event, cache));
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}