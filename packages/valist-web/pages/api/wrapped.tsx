import query from '@/graphql/Wrapped.graphql';
import { WrappedCard } from '@/components/Wrapped/WrappedCard';
import client from '@/utils/apollo';
import { ImageResponse } from '@vercel/og';
// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(  
  req: NextRequest,
) {
  const VERCEL_ENV = process.env.VERCEL_ENV;
  const isProd = (VERCEL_ENV === 'production' || VERCEL_ENV === 'preview');
  const VERCEL_URL = isProd ? `https://${process.env.VERCEL_ENV}` : process.env.VERCEL_ENV;
  const { searchParams } = new URL(req.url);

  console.log('URL VALUES', process.env.VERCEL_URL, VERCEL_URL); 

  const hasAddress = searchParams.has('address');
  const address = hasAddress
    ? searchParams.get('address')
    : '0x';

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

  const rankRes = await fetch(`${VERCEL_URL}/api/ranking?address=${address}`);
  const rank = String((await rankRes.text() || '0'));
  let metaRes: any;
  let meta = {};

  try {
    if (stats.FirstProject && stats.FirstProject.metaURI) {
      metaRes = await fetch(stats.FirstProject.metaURI);
      meta = await metaRes.json();
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
        rank={rank}
        address={String(address) || ''} 
      />
    ), {
      width: 450,
      height: 550,
    },
  );
}