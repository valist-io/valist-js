import { ApolloCache } from '@apollo/client';
import * as utils from './utils';
import { Client, ProjectMeta } from "@valist/sdk";
import { addSecret, createPullRequest } from '@/utils/github';
import { Octokit } from '@octokit/core';
import { Anchor } from '@mantine/core';
import { getBlockExplorer } from '@/components/Activity';
import { handleEvent } from './events';

export async function linkRepo(
  address: string | undefined,
  projectId: string,
  projectMeta: ProjectMeta,
  repository: string,
  publicKey: string,
  privateKey: string,
  valistConfig: string,
  valist: Client,
  client: Octokit,
  cache: ApolloCache<any>,
  chainId: number,
  setShowStatus: (value: boolean) => void,
  setStatusStep: (value: number) => void,
) {
  utils.hideError();

  if (!address) {
    throw new Error('connect your wallet to continue');
  }
  try {
    const [owner, repo] = repository.split('/');
    setShowStatus(true);
    utils.showLoading('Creating transaction');
    const addTransaction = await valist.addProjectMember(projectId, publicKey);

    const addMessage = <Anchor target="_blank"  href={getBlockExplorer(chainId, addTransaction.hash)}>Waiting for transaction - View transaction</Anchor>;
    utils.updateLoading(addMessage);
  
    const addReceipt = await addTransaction.wait();
    addReceipt.events?.forEach(event => handleEvent(event, cache));
    setStatusStep(2);

    if (addReceipt) {
      await addSecret(client, owner, repo, 'VALIST_SIGNER', privateKey);
      setStatusStep(3);
    
      const linkTransaction = await valist.setProjectMeta(projectId, { ...projectMeta, repository });
      const linkMessage = <Anchor target="_blank"  href={getBlockExplorer(chainId, linkTransaction.hash)}>Waiting for transaction - View transaction</Anchor>;
      utils.updateLoading(linkMessage);

      const receipt = await linkTransaction.wait();
      receipt.events?.forEach(event => handleEvent(event, cache));
      setStatusStep(4);

      await createPullRequest(client, valistConfig, owner, repo);
      setStatusStep(5);
    }
    setShowStatus(false);
  } catch (error: any) {
    utils.showError(error);
    console.log(error);
  } finally {
    utils.hideLoading();
  }
}