import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    res.send(session);
  } else {
    res.send({
      error: "Not authenticated.",
    });
  }
};