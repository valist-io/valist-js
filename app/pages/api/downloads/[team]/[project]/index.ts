import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../utils/Mongo/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const client = await clientPromise;
  const db = await client.db('statsdb');
  const { team, project } = req.query;

  const downloads = await db
    .collection('stats')
    .find({ package: `${team}/${project}` })
    .count();

  res.json(downloads);
};
