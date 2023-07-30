import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { DiscoveryCard } from '@/components/DiscoveryCard';
import { filterAddresses } from '@/utils/config';
import { client } from '@/components/ApolloProvider';
import query from '@/graphql/Discover.graphql';

import {
  Group,
  SimpleGrid,
  Stack,
  Title,
  Text,
  useMantineTheme,
} from '@mantine/core';

import {
  Button,
  DiscoveryFooter,
} from '@valist/ui';
import { ProjectMeta } from '@valist/sdk';
import { Project } from '@valist/sdk/dist/graphql';
import Link from 'next/link';

export async function getStaticProps() {
  const variables = { order: 'desc', filterAddresses };
  const { data } = await client.query({ query, variables });

  const projectMap = new Map<string, any>();
  const releases = data?.releases ?? [];

  releases.map((r: any) => r.project)
    .forEach((p: any) => projectMap.set(p.id, p));

  const recent = Array.from(projectMap.values());
  const newest = recent.slice()
    .sort((a: any, b: any) => b.blockTime.localeCompare(a.blockTime));

  return {
    props: { recent, newest },
    revalidate: 1 * 60 * 60,
  };
}

export interface DiscoverProps {
  recent: Project[];
  newest: Project[];
}

const Discover: NextPage<DiscoverProps> = (props) => {
  const theme = useMantineTheme();
  const [offset, setOffset] = useState(12);

	return (
    <Layout padding={0}>
      <div style={{ padding: 40 }}>
          <Stack>
            <Title size={32}>Recently Updated</Title>
            <SimpleGrid
              breakpoints={[
                { minWidth: 'sm', cols: 1, spacing: 32 },
                { minWidth: 'md', cols: 2, spacing: 32 },
                { minWidth: 'lg', cols: 3, spacing: 32 },
                { minWidth: 'xl', cols: 4, spacing: 32 },
              ]}
            >
              {props.recent.slice(0, 8).map((project: any, index: number) =>
                <Metadata key={index} url={project.metaURI}>
                  {(data: ProjectMeta) => (
                    <DiscoveryCard link={`/${project.account.name}/${project?.name}`} {...data} /> 
                  )}
                </Metadata>,
              )}
            </SimpleGrid>
          </Stack>
          <Stack pt={100}>
            <Title size={32}>Newest Apps and Games</Title>
            <SimpleGrid
              breakpoints={[
                { minWidth: 'sm', cols: 1, spacing: 32 },
                { minWidth: 'md', cols: 2, spacing: 32 },
                { minWidth: 'lg', cols: 3, spacing: 32 },
                { minWidth: 'xl', cols: 4, spacing: 32 },
              ]}
            >
              {props.newest.slice(0, offset).map((project: any, index: number) =>
                <Metadata key={index} url={project.metaURI}>
                  {(data: ProjectMeta) => (
                    <DiscoveryCard link={`/${project.account.name}/${project?.name}`} {...data} /> 
                  )}
                </Metadata>,
              )}
            </SimpleGrid>
            <Group position="center" mt={32}>
              <Button onClick={() => setOffset(offset + 12)}>
                Load More
              </Button>
            </Group>
          </Stack>
      </div>
      <div style={{ height: 584, position: 'relative' }}>
        <Image
          style={{ zIndex: -1 }}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="publish-now"
          src={`/images/discovery/publish_promo_${theme.colorScheme}.jpg`}
          priority
        />
        <Stack spacing={0} align="start" justify="center" p={64} style={{ height: '100%' }}>
          <Title color="white" size={56}>Publish Today</Title>
          <Text color="white" size={24} mt={24}>Have your software, webapp, or game</Text>
          <Text color="white" size={24} mb={40}>hosted on Valist to be truly decentralized!</Text>
          <Link href="/-/dashboard" passHref>
            <Button style={{ background: 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)' }}>
              Publish Now
            </Button>
          </Link>
        </Stack>
      </div>
      <DiscoveryFooter />
    </Layout>
	);
};

export default Discover;