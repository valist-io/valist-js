import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../../utils/Mongo/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { team, project } = req.query;

  const now = new Date().getTime();
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  const client = await clientPromise;
  const db = await client.db('statsdb');
  const downloads = await db
    .collection('stats')
    .find({
      package: `${team}/${project}`,
      timestamp: { $gt: now - thirtyDays, $lt: now },
    })
    .count();

  res.json(downloads);
};
