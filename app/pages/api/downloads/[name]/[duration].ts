import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../../utils/Mongo/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const client = await clientPromise;
  const db = await client.db('statsdb');
  const { name, duration } = req.query;

  const currentDate = new Date();
  const thirtyDayOffset = 86400 * 30;
  let dateOffset;

  if (parseInt((duration as string), 10) === 30) {
    dateOffset = parseInt(currentDate.toString(), 10) - thirtyDayOffset;
  } else {
    res.status(400).send({ message: 'Please provide a valid duration (30) day' });
  }

  const downloads = await db
    .collection('stats')
    .find({
      package: name,
      timestamp: { $lt: new Date(), $gt: dateOffset },
    })
    .count();

  res.json(downloads);
};
