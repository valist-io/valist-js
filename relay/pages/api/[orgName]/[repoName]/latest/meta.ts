import { NextApiRequest, NextApiResponse } from 'next'
import Valist, { Web3Providers } from 'valist';

export default async function getLatestReleaseMeta(req: NextApiRequest, res: NextApiResponse) {

  // set .env.local to your local chain or set in production deployment
  if (process.env.WEB3_PROVIDER) {
    const provider = new Web3Providers.HttpProvider(process.env.WEB3_PROVIDER);

    const valist = new Valist(provider);
    await valist.connect();

    const {
      query: { orgName, repoName },
    } = req;

    const releaseMeta = await valist.getLatestReleaseMetaFromRepo(orgName.toString(), repoName.toString());

    if (releaseMeta) {
      //return res.status(200).json({releaseMeta});
      return res.redirect(`https://cloudflare-ipfs.com/ipfs/${releaseMeta}`);
    } else {
      return res.status(404).json({statusCode: 404, message: "No release found!"});
    }

  } else {
    return res.status(500).json({statusCode: 500, message: "No Web3 Provider!"});
  }
}