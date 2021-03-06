import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { generateID } from '@valist/sdk';
import { createValistClient } from '@/utils/Account';
import { defaultProvider } from '@/utils/Providers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accountName, projectName, address } = req.query;
  const { publicRuntimeConfig } = getConfig();

  const chainID = publicRuntimeConfig.CHAIN_ID;
  const accountID = generateID(chainID, `${ accountName }`);
  const projectID = generateID(accountID, `${ projectName }`);

  try {
    const valist = await createValistClient(defaultProvider);
    if (!valist) return res.status(500).json({ error: 'failed to get project' });

    const balance = await valist.getProductBalance(`${ address }`, projectID);
    res.status(200).json({ balance: balance.toString() });
  } catch(err) {
    res.status(500).json({ error: 'failed to get project' });
  }
}
