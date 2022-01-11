import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../../utils/Mongo/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { team, project, version } = req.query;

  const client = await clientPromise;
  const db = await client.db('statsdb');

  const downloads = await db
    .collection('stats')
    .find({ package: `${team}/${project}`, version })
    .count();

  res.json(downloads);
};
