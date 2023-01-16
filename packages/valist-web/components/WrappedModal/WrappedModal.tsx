import query from '@/graphql/Wrapped.graphql';
import { Flex, Grid, Modal, Text } from '@mantine/core';
import { Metadata } from '../Metadata';
import Image from 'next/image';
import { useClipboard } from '@mantine/hooks';
import { useQuery } from '@apollo/client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import getConfig from 'next/config';

export interface WrappedModalProps {
  address: string;
  loading?: boolean;
  opened: boolean;
  onClose: () => void;
}

export function WrappedModal(props: WrappedModalProps) {
  const { publicRuntimeConfig } = getConfig();
  const VERCEL_ENV = publicRuntimeConfig.VERCEL_ENV;
  const isProd = (VERCEL_ENV === 'production' || VERCEL_ENV === 'preview');
  const VERCEL_URL = isProd ? `https://${publicRuntimeConfig.VERCEL_URL}` : publicRuntimeConfig.VERCEL_URL;

  const clipboard = useClipboard({ timeout: 500 });
  const [rank, setRank] = useState<string>('0');

  const { data } = useQuery(query, {
    query: query,
    variables: { sender: String(props.address).toLowerCase() },
  });

  const logs: any[] = data?.logs || [];

  const stats: any = {};
  const releases: any = {};

  if (data) {
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
  }

  useEffect(() => {
    (async () => {
      const rankRes = await axios.get(`${VERCEL_URL}/api/ranking?address=${String(props.address).toLowerCase()}`);
      setRank(String(rankRes.data || 0));
    })();
  }, [VERCEL_URL, props.address]);

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      padding={0}
      size={900}
      centered
      withCloseButton={false}
      style={{ backgroundColor: '#ffffff' }}
    >
      <Grid>
        <Grid.Col md={6} p={40}>
          <Text size={24} weight={700} mb={8}>Your 2022 with Valist</Text>
          <Text size={14} weight={400} mb={32} color="#9595A8">You have been amazing this 2022 and we love you. Cant wait to see what awesome projects you create in 2023  🎉</Text>

          <Text size={14} color="#9595A8">Share</Text>
          <Flex
            gap={8}
          >
            <div onClick={() => window.open(`https://www.facebook.com/sharer.php?u=https://app.valist.io/-/wrapped/${props.address}`)} style={{ padding: 8 }}>
              <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.26428 15.2221V8.34044H7.58588L7.93097 5.64604H5.26428V3.92982C5.26428 3.15232 5.48091 2.61999 6.59679 2.61999H8.01074V0.217784C7.32277 0.144056 6.63125 0.108457 5.93935 0.11115C3.88727 0.11115 2.47836 1.36389 2.47836 3.66366V5.64101H0.171875V8.33541H2.4834V15.2221H5.26428Z" fill="#9B9BB1"/>
              </svg>
            </div>
            
            <div onClick={() => window.open(`https://twitter.com/intent/tweet?text=Checkout%20my%20@Valist%20wrapped!%20https://app.valist.io/-/wrapped/${props.address}`)} style={{ padding: 8 }}>
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.9951 0.951413C15.9952 0.822994 15.9613 0.696845 15.8967 0.585815C15.8322 0.474785 15.7394 0.38284 15.6278 0.319344C15.5161 0.255847 15.3897 0.223068 15.2613 0.224343C15.1329 0.225619 15.0071 0.260904 14.8967 0.326606C14.4712 0.579898 14.013 0.773873 13.535 0.903152C12.8523 0.317323 11.9815 -0.00325153 11.0819 2.48681e-05C10.095 0.00116097 9.14719 0.385789 8.43857 1.07269C7.72994 1.7596 7.31599 2.695 7.28413 3.6814C5.33855 3.37114 3.57521 2.35565 2.33038 0.828579C2.25538 0.737579 2.15959 0.66595 2.0511 0.619733C1.9426 0.573516 1.82459 0.554067 1.707 0.563026C1.58948 0.572703 1.47609 0.61086 1.37662 0.674199C1.27716 0.737538 1.19463 0.824151 1.13615 0.926548C0.836267 1.44988 0.664033 2.03657 0.633438 2.63896C0.602844 3.24135 0.71475 3.84247 0.960071 4.3935L0.958653 4.39491C0.848394 4.46282 0.757401 4.55788 0.694376 4.67101C0.631351 4.78413 0.598402 4.91153 0.598679 5.04102C0.597344 5.14785 0.603751 5.25463 0.617851 5.36052C0.692109 6.27534 1.09754 7.13164 1.75812 7.76886C1.71331 7.85423 1.68596 7.94768 1.67766 8.04374C1.66937 8.1398 1.68031 8.23655 1.70984 8.32834C1.99783 9.22562 2.61028 9.98314 3.42734 10.4527C2.59723 10.7737 1.70091 10.8856 0.817359 10.7786C0.653827 10.758 0.488175 10.7937 0.347578 10.8797C0.206981 10.9657 0.099786 11.0969 0.043577 11.2519C-0.0126319 11.4068 -0.0145172 11.5763 0.0382303 11.7324C0.0909777 11.8885 0.195226 12.0221 0.333875 12.1112C1.85347 13.09 3.62279 13.6103 5.43029 13.6101C7.48001 13.6331 9.4799 12.9781 11.1189 11.747C12.7578 10.5158 13.9439 8.77754 14.4927 6.80252C14.7494 5.94216 14.8805 5.04923 14.8819 4.1514C14.8819 4.10383 14.8819 4.05484 14.8811 4.00585C15.2607 3.59647 15.5548 3.11544 15.7461 2.59095C15.9374 2.06645 16.022 1.50905 15.9951 0.951413ZM13.591 3.28661C13.471 3.42864 13.4102 3.61146 13.4214 3.79711C13.4285 3.91707 13.4277 4.03776 13.4277 4.1514C13.4263 4.9101 13.3151 5.66459 13.0976 6.39146C12.6494 8.07195 11.6502 9.5534 10.26 10.5986C8.86984 11.6437 7.16915 12.1922 5.43029 12.156C4.80567 12.1562 4.1832 12.0828 3.57576 11.9373C4.35036 11.6877 5.07462 11.3028 5.715 10.8006C5.83294 10.7077 5.91926 10.5806 5.96211 10.4368C6.00496 10.2929 6.00224 10.1393 5.95432 9.99702C5.90641 9.85476 5.81564 9.7308 5.69448 9.64217C5.57332 9.55354 5.4277 9.50458 5.27761 9.50199C4.67331 9.4926 4.09626 9.24899 3.66803 8.82252C3.77666 8.80193 3.88458 8.77637 3.99179 8.74584C4.14884 8.70113 4.28628 8.60488 4.38197 8.47257C4.47766 8.34026 4.52604 8.17959 4.51932 8.01644C4.51259 7.8533 4.45116 7.69716 4.34491 7.57317C4.23866 7.44918 4.09377 7.36456 3.93357 7.33293C3.5828 7.26365 3.25273 7.11442 2.96901 6.89683C2.6853 6.67924 2.45558 6.39916 2.29772 6.07835C2.42912 6.09628 2.56136 6.10742 2.6939 6.11172C2.85137 6.1141 3.00551 6.06633 3.13404 5.97533C3.26257 5.88432 3.35882 5.7548 3.40888 5.60548C3.45685 5.45481 3.45438 5.29261 3.40185 5.14347C3.34932 4.99433 3.24959 4.86639 3.11778 4.77904C2.79799 4.56599 2.53603 4.27696 2.35537 3.93782C2.17471 3.59868 2.08098 3.22002 2.08259 2.83577C2.08259 2.78749 2.08401 2.73921 2.08685 2.69164C3.71635 4.21134 5.82991 5.1072 8.05516 5.22138C8.16748 5.22581 8.27934 5.20465 8.38229 5.15951C8.48524 5.11437 8.57659 5.04642 8.64944 4.96081C8.72154 4.87436 8.7726 4.77236 8.79859 4.66284C8.82458 4.55331 8.82479 4.43924 8.79921 4.32962C8.75763 4.15612 8.73642 3.97836 8.73602 3.79995C8.73668 3.17799 8.98405 2.58169 9.42384 2.1419C9.86363 1.70211 10.4599 1.45475 11.0819 1.45409C11.4019 1.45323 11.7186 1.51872 12.012 1.64643C12.3054 1.77413 12.5692 1.96128 12.7866 2.19605C12.8705 2.28626 12.976 2.35352 13.0932 2.39143C13.2104 2.42934 13.3353 2.43664 13.4561 2.41263C13.7548 2.3545 14.0492 2.27623 14.3372 2.17833C14.1407 2.58036 13.8896 2.95332 13.591 3.28661Z" fill="#9B9BB1"/>
              </svg>
            </div>

            <div onClick={() => clipboard.copy(`https://app.valist.io/-/wrapped/${props.address}`)} style={{ padding: 8, backgroundColor: clipboard.copied ? '#d8d8ff': '' }}>
              <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.4 5.552C14.3917 5.47851 14.3756 5.4061 14.352 5.336V5.264C14.3135 5.18174 14.2622 5.10613 14.2 5.04L9.4 0.24C9.33387 0.177773 9.25826 0.126465 9.176 0.0879999C9.15212 0.0846081 9.12788 0.0846081 9.104 0.0879999C9.02273 0.041393 8.93298 0.0114754 8.84 0H5.6C4.96348 0 4.35303 0.252856 3.90294 0.702944C3.45286 1.15303 3.2 1.76348 3.2 2.4V3.2H2.4C1.76348 3.2 1.15303 3.45286 0.702944 3.90294C0.252856 4.35303 0 4.96348 0 5.6V13.6C0 14.2365 0.252856 14.847 0.702944 15.2971C1.15303 15.7471 1.76348 16 2.4 16H8.8C9.43652 16 10.047 15.7471 10.4971 15.2971C10.9471 14.847 11.2 14.2365 11.2 13.6V12.8H12C12.6365 12.8 13.247 12.5471 13.6971 12.0971C14.1471 11.647 14.4 11.0365 14.4 10.4V5.6C14.4 5.6 14.4 5.6 14.4 5.552ZM9.6 2.728L11.672 4.8H10.4C10.1878 4.8 9.98434 4.71571 9.83432 4.56569C9.68429 4.41566 9.6 4.21217 9.6 4V2.728ZM9.6 13.6C9.6 13.8122 9.51571 14.0157 9.36569 14.1657C9.21566 14.3157 9.01217 14.4 8.8 14.4H2.4C2.18783 14.4 1.98434 14.3157 1.83431 14.1657C1.68429 14.0157 1.6 13.8122 1.6 13.6V5.6C1.6 5.38783 1.68429 5.18434 1.83431 5.03431C1.98434 4.88429 2.18783 4.8 2.4 4.8H3.2V10.4C3.2 11.0365 3.45286 11.647 3.90294 12.0971C4.35303 12.5471 4.96348 12.8 5.6 12.8H9.6V13.6ZM12.8 10.4C12.8 10.6122 12.7157 10.8157 12.5657 10.9657C12.4157 11.1157 12.2122 11.2 12 11.2H5.6C5.38783 11.2 5.18434 11.1157 5.03431 10.9657C4.88429 10.8157 4.8 10.6122 4.8 10.4V2.4C4.8 2.18783 4.88429 1.98434 5.03431 1.83431C5.18434 1.68429 5.38783 1.6 5.6 1.6H8V4C8 4.63652 8.25286 5.24697 8.70294 5.69706C9.15303 6.14714 9.76348 6.4 10.4 6.4H12.8V10.4Z" fill="#9B9BB1"/>
              </svg>
            </div>
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
            <Text id="test" size={90} color={'#F79009'} style={{ lineHeight: 1 }}>
              {stats.ProjectCreated}
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
              Total Releases: {stats.ReleaseCreated}
            </div>
            <div>
              No. of on-chain transactions: {stats.TotalTransactions}
            </div>
            <div>
              Software Licenses created: {stats.PriceChanged}
            </div>
            <div>
              Valist Ranking: {rank}
            </div>
          </Flex>
          
          <div>
            <Text size={12} weight={400} mb={8} color="#CBC9F9">Your First Project</Text>
            {stats?.FirstProject && 
              <Metadata url={stats.FirstProject.metaURI}>
                {(meta: any) => ( 
                  <Flex
                    gap={16}
                  >
                    <Image height={100} width={130} alt="project-img" src={meta?.image} />
                    <div>
                      <div style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 700 }}>
                      {stats?.FirstProject?.account.name}/{stats?.FirstProject?.name}
                      </div>
                      <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 400, marginBottom: 16 }}>
                        {meta?.short_description}
                      </div>
                    </div>
                  </Flex>
                )}
              </Metadata>
            }
          </div>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}