// import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await getSession({ req });

//   if (session) {
//     res.send(session);
//   } else {
//     res.send({
//       error: "Not authenticated.",
//     });
//   }
// };

// alternative way to do this by fetching jwt directly, but this is the straight up jwt not parsed into a session object so 'token.sub' is the address
import { getToken } from "next-auth/jwt";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await getToken({ req });
  if (token) {
    const address = token.sub;
    res.send({ address });
  } else {
    res.status(401);
  }
  res.end();
};
