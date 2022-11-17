import { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { NextLink } from '@mantine/next';
import { Carousel } from '@mantine/carousel';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { DiscoveryCard } from '@/components/DiscoveryCard';
import { filterAddresses } from '@/utils/config';
import { featuredApps, featuredGames, featuredTestnet } from '@/utils/discover';
import query from '@/graphql/Discover.graphql';

import {
  Anchor,
  Avatar,
  Group,
  SimpleGrid,
  Stack,
  Title,
  Text,
  useMantineTheme,
} from '@mantine/core';

import {
  Button,
  Card,
  DiscoveryFooter,
} from '@valist/ui';

const Discover: NextPage = () => {
  const theme = useMantineTheme();
  const [offset, setOffset] = useState(12);

  const { data } = useQuery(query, { 
    variables: { order: 'desc', filterAddresses },
  });

  const recent = data?.releases?.map((release: any) => release.project) ?? [];
  const newest = recent.slice().sort((a: any, b: any) => b.blockTime.localeCompare(a.blockTime));

	return (
    <Layout padding={0} hideNavbar>
      <div style={{ height: 500, position: 'relative' }}>
        <Image
          style={{ zIndex: -1 }}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="Shattered Realms"
          src="/images/discovery/shattered_realms.jpg"
          priority
        />
        <Stack align="center" justify="center" style={{ height: 500 }}>
          <Title color="white" size={96}>Shattered Realms</Title>
          <Text color="white" size={24}>Action, Adventure, RPG</Text>
          <NextLink href="/shatteredrealms/game">
            <Button>View Game</Button>
          </NextLink>
        </Stack>
      </div>
      <div style={{ padding: '56px 64px' }}>
        <Stack>
          <Title size={32}>Featured Games</Title>
          <Carousel
            height={340}
            slideGap={32}
            slideSize={280}
            align="start"
            dragFree
            loop
          >
            {featuredGames.map((item: any, index: number) => 
              <Carousel.Slide key={index}>
                <DiscoveryCard {...item} />
              </Carousel.Slide>,
            )}
          </Carousel>
        </Stack>
        <Stack pt={100}>
          <Title size={32}>Featured dApps</Title>
          <Carousel
            height={340}
            slideGap={32}
            slideSize={280}
            align="start"
            dragFree
            loop
          >
            {featuredApps.map((item: any, index: number) => 
              <Carousel.Slide key={index}>
                <DiscoveryCard {...item} />
              </Carousel.Slide>,
            )}
          </Carousel>
        </Stack>
        <Stack pt={100}>
          <Title size={32}>Featured on Testnet</Title>
          <Carousel
            height={340}
            slideGap={32}
            slideSize={280}
            align="start"
            dragFree
            loop
          >
            {featuredTestnet.map((item: any, index: number) => 
              <Carousel.Slide key={index}>
                <DiscoveryCard {...item} />
              </Carousel.Slide>,
            )}
          </Carousel>
        </Stack>
        <Stack pt={100}>
          <Title size={32}>Recently Updated</Title>
          <SimpleGrid
            breakpoints={[
              { minWidth: 'sm', cols: 1, spacing: 24 },
              { minWidth: 'md', cols: 2, spacing: 24 },
              { minWidth: 'lg', cols: 4, spacing: 16 },
            ]}
          >
            {recent.slice(0, 8).map((project: any, index: number) =>
              <Metadata key={index} url={project.metaURI}>
                {(data: any) => (
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
              { minWidth: 'sm', cols: 1, spacing: 24 },
              { minWidth: 'md', cols: 2, spacing: 24 },
              { minWidth: 'lg', cols: 4, spacing: 16 },
            ]}
          >
            {newest.slice(0, offset).map((project: any, index: number) =>
              <Metadata key={index} url={project.metaURI}>
                {(data: any) => (
                  <DiscoveryCard link={`/${project.account.name}/${project?.name}`} {...data} /> 
                )}
              </Metadata>,
            )}
          </SimpleGrid>
          <Group position="center">
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
          alt="Shattered Realms"
          src={`/images/discovery/publish_promo_${theme.colorScheme}.jpg`}
          priority
        />
        <Stack spacing={0} align="start" justify="center" p={64} style={{ height: '100%' }}>
          <Title color="white" size={56}>Publish Today</Title>
          <Text color="white" size={24} mt={24}>Have your software, webapp, or game</Text>
          <Text color="white" size={24} mb={40}>hosted on Valist to be truly decentralized!</Text>
          <NextLink href="/-/dashboard">
            <Button style={{ background: 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)' }}>
              Publish Now
            </Button>
          </NextLink>
        </Stack>
      </div>
      <DiscoveryFooter />
    </Layout>
	);
};

export default Discover;
