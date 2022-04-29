import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { generateID } from '@valist/sdk';
import { createValistClient } from '@/utils/Account';
import { defaultProvider } from '@/utils/Providers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { accountName } = req.query;
  const { publicRuntimeConfig } = getConfig();

  const chainID = publicRuntimeConfig.CHAIN_ID;
  const accountID = generateID(chainID, `${ accountName }`);

  try {
    const valist = await createValistClient(defaultProvider);
    if (!valist) return res.status(500).json({ error: 'failed to get account' });
    
    const account = await valist.getAccountMeta(accountID);
    res.status(200).json(account);
  } catch(err) {
    res.status(500).json({ error: 'failed to get account' });
  }
}
