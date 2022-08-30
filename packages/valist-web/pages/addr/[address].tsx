import { NextPage } from "next";
import { useMediaQuery } from '@mantine/hooks';
// import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Grid, Group, List, Stack, Title } from "@mantine/core";
import { Activity, Breadcrumbs, Card, CardGrid, InfoButton, ItemHeader, MemberStack, ProjectCard } from "@valist/ui";
import { useRouter } from "next/router";
import { Metadata } from "@/components/Metadata";
import { NextLink } from "@mantine/next";
import { useQuery } from "@apollo/client";
import query from '@/graphql/AddressPage.graphql';

const AddressPage: NextPage = () => {
  const router = useRouter();
  const fullAddress = `${router.query.address}`;
  const trunAddress = `${fullAddress.slice(0, 6)}..${fullAddress.slice(-4)}`;

  // const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const { data:userData } = useQuery(query, { 
    variables: { address: fullAddress.toLowerCase() || '' },
  });

  const projects = (userData?.users.length !== 0 && userData?.users[0].projects) || [];
  // const logs = (userData?.users.length !== 0 && userData?.users[0].logs) || [];

  const breadcrumbs = [
    { title: trunAddress, href: `/addr/${fullAddress}` },
  ];

  console.log('data', userData);

  return (
    <Layout padding={0}>
       <Group mt={40} pl={40} position="apart">
        <Breadcrumbs items={breadcrumbs} />
        {/* { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        } */}
      </Group>
      <div style={{ padding: 40 }}>
        <ItemHeader 
          name={trunAddress}
          label={fullAddress}
          image={''}
          leftActions={[]}
          rightActions={[]}
        />

        <Grid>
          <Grid.Col xl={8}>
            { projects.length !== 0 && 
              <CardGrid>
                {projects.map((project: any, index: number) =>
                  <Metadata key={index} url={project.metaURI}>
                    {(data: any) =>
                      <NextLink
                        style={{ textDecoration: 'none' }}
                        href={`/${project?.account?.name}/${project.name}`}
                      >
                        <ProjectCard
                          title={project.name} 
                          secondary={data?.name}
                          description={data?.description} 
                          image={data?.image} 
                        />
                      </NextLink>
                    }
                  </Metadata>,
                )}
              </CardGrid>
            }
          </Grid.Col>

          {/* { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Recent Activity</Title>
                    <List>
                      {logs.slice(0, 4).map((log: any, index: number) => 
                        <Activity key={index} {...log} />,
                      )}
                    </List>
                  </Stack>
                </Card>
              </Stack>
            </Grid.Col>
          } */}
        </Grid>
      </div>
    </Layout>
  );
};

export default AddressPage;
