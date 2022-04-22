import getConfig from 'next/config';
import { generateID } from '@valist/sdk';
import { createValistClient } from '@/utils/Account';
import { defaultProvider } from '@/utils/Providers';

export default async function handler(req, res) {
  const { accountName, projectName, releaseName } = req.query;
  const { publicRuntimeConfig } = getConfig();

  const chainID = publicRuntimeConfig.CHAIN_ID;
  const accountID = generateID(chainID, accountName);
  const projectID = generateID(accountID, projectName);
  const releaseID = generateID(projectID, releaseName);

  try {
    const valist = await createValistClient(defaultProvider);
    const account = await valist.getReleaseMeta(releaseID);
    res.status(200).json(account);
  } catch(err) {
    res.status(500).json({error: 'failed to get release'});
  }
}
