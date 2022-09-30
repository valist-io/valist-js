import { sendStats } from '@valist/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function stats(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'PUT') {
    res.status(400).send({ message: 'Only PUT requests allowed' });
    return;
  }

  const { team, project, version } = req.query;
  const resp = await sendStats(`${team}/${project}/${version}`);
  res.status(200).send({ message: 'success' });
};
