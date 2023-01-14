import query from '@/graphql/Wrapped.graphql';
import { WrappedCard } from '@/components/Wrapped/WrappedCard';
import client from '@/utils/apollo';
import { ImageResponse } from '@vercel/og';
import { NextApiRequest } from 'next';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(  
  req: NextApiRequest,
) {
  
  const address = "0xbD8C79740Bf625F5054E86a2CE4e73879382f923";

  const { data } = await client.query({
    query: query,
    variables: { sender: String(address).toLowerCase() },
  });

  const logs: any[] = data.logs;

  const stats: any = {};
  const releases: any = {};

  for (let i = 0; i < logs.length; i++) {
      const type = logs[i]['type'];
      const count: number = stats[type];

      stats[type] = count ? count + 1 : 1;

      if (type !== 'ProductPurchased' && logs[i]?.project) {
          const key = `${logs[i]?.project?.account?.name}/${logs[i]?.project?.name}`;
          releases[key] = logs[i]?.project?.releases.length;
      }
  }

  stats['TotalTransactions'] = (Object.values(stats) as number[]).reduce((a: number, b: number) => a + b); // needs to come first
  stats['AccountReleases'] = (Object.values(releases).filter(Boolean) as number[]) || [0, 0].reduce((a: number, b: number) => a + b);
  stats['FirstProject'] = logs.find((event: any) => event.type == 'ProjectCreated')?.project;
  // stats['LatestProject'] = logs.findLast((event: any) => event.type == 'ProjectCreated')?.project;

  // console.log(logs);
  let metaRes: any;
  let meta = {};

  try {
    if (stats.FirstProject && stats.FirstProject.metaURI) {
      console.log(stats.FirstProject.metaURI);
      metaRes = await fetch(stats.FirstProject.metaURI);
      meta = await metaRes.json();
      console.log('meta', meta);
    }
  } catch(e) {
    console.log('Failed to fetch meta!', e);
  }

  return new ImageResponse(
    (
      <WrappedCard 
        stats={stats} 
        data={data}
        logs={logs} 
        meta={meta}
        address={String(address) || ''} 
      />
    ), {
      width: 450,
      height: 491,
    },
  );
}