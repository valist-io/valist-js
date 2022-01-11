import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../utils/Mongo/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method !== 'PUT') {
    res.status(400).send({ message: 'Only PUT requests allowed' });
    return;
  }

  const { team, project } = req.query;
  const client = await clientPromise;
  const db = await client.db('statsdb');

  await db.collection('stats').insertOne({
    package: `${team}/${project}`,
    timestamp: new Date().getTime(),
  });

  res.status(200).send({ message: 'success' });
};
