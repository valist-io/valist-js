import type { NextPage } from 'next';
import { Layout } from '@/components/Layout';
import { HeroSection, Carousel, PublishPromo, DiscoveryFooter, CardGrid, Button } from '@valist/ui';
import { useMediaQuery } from '@mantine/hooks';
import { CarouselItem } from '@valist/ui/dist/components/Carousel';
import { useQuery } from '@apollo/client';
import query from '@/graphql/Discover.graphql';
import { Metadata } from '@/components/Metadata';
import { Center, SimpleGrid } from '@mantine/core';
import { useState } from 'react';
import { TopPublishers } from '@/components/TopPublishers';
import { filterAddresses } from '@/utils/config';
import { featuredApps, featuredGames, featuredTestnet } from '@/utils/discover';

const Discover: NextPage = () => {
  const [latestIndex, setLatestIndex] = useState(12);
  const { data } = useQuery(query, { 
    variables: { order: 'desc', filterAddresses },
  });

  let publisherCounts: Record<string, {count: number, account: any}> = {};
  let pairs: Record<string, boolean> = {};

  const projects = data?.releases.map((release: any) => {
    // Get Publisher Counts
    const publisherCount = publisherCounts[release?.project?.account?.name];
    publisherCounts[release?.project?.account?.name] = {
      account: release?.project?.account,
      count: publisherCount ? publisherCounts[release?.project?.account?.name].count + 1 : 1,
    };

    // Create sorted project array
    if (!pairs[`${release.project.account.name}/${release.project.name}`]) {
      pairs[`${release.project.account.name}/${release.project.name}`] = true;
      return release.project;
    }
  }).filter(Boolean) || [];

  const sortedProjects = [...projects].sort((a: any, b: any) => parseFloat(b.blockTime) - parseFloat(a.blockTime));

  const topAccounts = Object.keys(publisherCounts).map((name) => {
    const publisher = publisherCounts[name];
    return { ...publisher.account, count: publisher.count };
  }).sort((a: any, b: any) => b.count - a.count);

  const isMobile = useMediaQuery('(max-width: 900px)');
  const paddingY = isMobile ? '24px' : '64px';
  
	return (
    <div style={{ overflow: 'hidden' }}>
      <Layout hideNavbar={true} padding={0}>
          <section>
            <HeroSection
              image={"/images/discovery/shattered_realms.png"} 
              title={'Shattered Realms'} 
              tagline={'Action, Adventure, RPG'} 
              link={'/shatteredrealms/game'}
          /> 
          </section>
          
          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <Carousel title={"Featured Games"} number={5} items={featuredGames} />
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <Carousel title={"Featured dApps"} number={5} items={featuredApps} />
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <Carousel title={"Featured on Testnet"} number={5} items={featuredTestnet} />
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <h2 style={{ fontStyle: 'normal', fontWeight: 700, fontSize: isMobile ? 18 : 32 }}>Recently Updated</h2>
            {projects.length !== 0 &&
                <SimpleGrid
                  breakpoints={[
                    { minWidth: 'sm', cols: 1, spacing: 24 },
                    { minWidth: 'md', cols: 2, spacing: 24 },
                    { minWidth: 'lg', cols: 4, spacing: 16 },
                  ]}
                >
                  {projects.slice(0, 8).map((project: any, index: number) =>
                    <Metadata key={index} url={project.metaURI}>
                      {(data: any) =>
                        <CarouselItem 
                          img={data?.image || '/images/valist.png'} 
                          name={data?.name} 
                          description={data?.description} 
                          link={`/${project.account.name}/${project?.name}`}
                          type={data?.type}
                        />
                      }
                    </Metadata>,
                  )}
                </SimpleGrid>
            }
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <h2 style={{ fontStyle: 'normal', fontWeight: 700, fontSize: isMobile ? 18 : 32 }}>Newest Apps and Games</h2>
            {sortedProjects.length !== 0 &&
              <>
                <SimpleGrid
                  breakpoints={[
                    { minWidth: 'sm', cols: 1, spacing: 24 },
                    { minWidth: 'md', cols: 2, spacing: 24 },
                    { minWidth: 'lg', cols: 4, spacing: 16 },
                  ]}
                >
                  {sortedProjects.slice(0, latestIndex).map((project: any, index: number) =>
                    <Metadata key={index} url={project.metaURI}>
                      {(data: any) =>
                        <CarouselItem 
                          img={data?.image || '/images/valist.png'} 
                          name={data?.name} 
                          description={data?.description} 
                          link={`/${project.account.name}/${project?.name}`}
                          type={data?.type}
                        />
                      }
                    </Metadata>,
                  )}
                </SimpleGrid>
                <Center>
                  <Button
                    style={{ margin: '30px 0 60px 0' }} 
                    onClick={() => setLatestIndex(latestIndex + 12)}
                  >
                  Load More
                </Button>
               </Center>
              </>
            }
          </section>

          <section style={{ marginBottom: 80, padding: `0 ${paddingY}` }}>
            <TopPublishers accounts={topAccounts} />
          </section>

          <section>
              <PublishPromo />
          </section>
          
          <section>
              <DiscoveryFooter />
          </section>
      </Layout>
    </div>
	);
};

export default Discover;
