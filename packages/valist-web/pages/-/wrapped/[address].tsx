import query from '@/graphql/Wrapped.graphql';
import client from "@/utils/apollo";
import { Button, Flex, Grid, Text } from '@mantine/core';
import Image from 'next/image';
import axios, { AxiosResponse } from 'axios';
import { ProjectMeta } from '@valist/sdk';
import { cidRegex } from '@/forms/common';
import { useEffect } from 'react';

interface Stats {
  ReleaseCreated?: number,
  PriceChanged?: number,
  ProjectUpdated?: number,
  ProductPurchased?: number,
  ProjectCreated?: number,
  ProjectMemberAdded?: number,
  AccountUpdated?: number,
  AccountMemberRemoved?: number,
  AccountMemberAdded?: number,
  AccountCreated?: number,
  AccountReleases?: number,
  TotalTransactions?: number,
  FirstProject: any,
  LatestProject: any,
}

export const getServerSideProps = async ({ params, res }: any) => {
  const { data } = await client.query({
    query: query,
    variables: { sender: String(params.address).toLowerCase() },
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

  console.log(logs);
  let metaRes: AxiosResponse<any>;
  let meta = {};

  try {
    if (stats.FirstProject && stats.FirstProject.metaURI) {
      metaRes = await axios.get(`https://gateway.valist.io/ipfs/${stats.FirstProject.metaURI.match(cidRegex)[1]}`);
      meta = metaRes?.data;
    }
  } catch(e) {
    console.log('Failed to fetch meta!', e);
  }
  
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=11',
  );

  return {
    props: {
      stats,
      data,
      meta,
      logs,
      address: params.address,
    },
  };
};

export default function WrappedPage(props: { stats: Stats, data: any, logs: any, meta: ProjectMeta, address: string,}) {
  useEffect(() => {
    // @ts-ignore
    window.data = props.logs;
  }, [props?.logs]);

  return (
    <Grid>
      <Grid.Col md={6} p={40}>
        <Text size={24} weight={700} mb={8}>{props.address}{"'s"} 2022 with Valist</Text>
        <Text size={14} weight={400} mb={32} color="#9595A8">{"It was an amazing 2022 and we love you. Checkout the projects you🎉"}</Text>

        <Button>Checkout your wrapped!</Button>
        <Flex
          gap={8}
        >
        </Flex>
      </Grid.Col>
      <Grid.Col md={6} py={40} px={32} style={{ background: 'linear-gradient(270deg, #8680F8 0.01%, #4152CF 100%)' }}>
        <Flex
          align="center"
          px={15}
          py={10}
          style={{ backgroundColor: '#fae8cf', borderRadius: 8 }}
          mb={19}
          gap={16}
        >
          <Text size={90} color={'#F79009'} style={{ lineHeight: 1 }}>
            {props.stats.ProjectCreated}
          </Text>
          <div>
            <Text style={{ fontSize: 12,color: '#9B9BB1' }}>
              Total Projects
            </Text>
            <Text style={{ fontSize: 24 }}>
              Published
            </Text>
          </div>
        </Flex>

        <Flex      
          direction="row"
          wrap="wrap"
          gap="md"
          style={{ fontSize: 12, border: '0.5px solid #FFFFFF', borderRadius: 8, color: "#FFFFFF" }}
          p={16}
          mb={24}
        >
          <div>
            Total Releases: {props.stats.ReleaseCreated}
          </div>
          <div>
            No. of on-chain transactions: {props.stats.TotalTransactions}
          </div>
          <div>
            Software Licenses created: {props.stats.PriceChanged}
          </div>
          <div>
            Valist Ranking: {5}
          </div>
        </Flex>
        
        <div>
          <Text size={12} weight={400} mb={8} color="#CBC9F9">Your First Project</Text>
          <Flex
            gap={16}
          >
            {/* {props?.meta?.image && props?.meta?.image.match(cidRegex)?.length !== 0 && <Image height={100} width={130} alt="project-img" src={
              `https://gateway.valist.io/ipfs/${props?.meta?.image.match(cidRegex)[1] || ''}`
            } />} */}

            <div>
              <div style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 700 }}>
                {props?.stats?.FirstProject?.account.name}/{props?.stats?.FirstProject?.name}
              </div>
              <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 400, marginBottom: 16 }}>
                {props?.meta?.short_description}
              </div>
              <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 400 }}>
                <div style={{ fontWeight: 700 }}>Last Edit: </div>
              </div>
            </div>
          </Flex>
        </div>
      </Grid.Col>
    </Grid>
  );
};
  
