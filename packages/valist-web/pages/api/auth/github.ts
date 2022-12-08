import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const { code } = req.query;

  const data = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    },
  );

  if (data) {
    res.status(200).json(data.data.substring(
      data.data.indexOf("=") + 1,
      data.data.indexOf("&"),
    ));
  }
  res.status(404);
}
