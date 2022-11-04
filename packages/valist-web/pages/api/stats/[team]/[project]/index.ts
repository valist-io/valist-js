import { getStats } from '@valist/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function stats(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== 'GET') {
    res.status(400).send({ message: 'Only GET requests allowed' });
    return;
  }

  const { team, project } = req.query;
  getStats(`${team}/${project}`).then((data) => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: 'Project not found' });
    };
  });
};
