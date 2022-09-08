import type { NextPage } from 'next';
import { useContext, useState } from 'react';
import { useNetwork, useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { ValistContext } from '@/components/ValistProvider';
import { Activity } from '@/components/Activity';
import query from '@/graphql/AccountPage.graphql';

import { 
  Anchor,
  Title,
  Text,
  Group, 
  Stack,
  Tabs,
  Grid,
} from '@mantine/core';

import {
  _404,
  Actions,
  Action,
  Button,
  Breadcrumbs,
  Card,
  CardGrid,
  InfoButton,
  Item,
  MemberList,
  MemberStack,
  ProjectCard,
  List,
  TabsListCard,
} from '@valist/ui';

const AccountPage: NextPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const router = useRouter();
  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id || 137, accountName);

  const { data, loading } = useQuery(query, { variables: { accountId } });
  const { data: meta } = useSWRImmutable(data?.account?.metaURI);

  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const projects = data?.account?.projects ?? [];
  const members = data?.account?.members ?? [];
  const logs = data?.account?.logs ?? [];

  const isMember = !!members.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const actions: Action[] = [
    {
      label: 'Settings', 
      icon: Icon.Settings, 
      href: `/-/account/${accountName}/settings`, 
      hide: !isMember,
      side: 'left',
    },
    {
      label: 'New Project',
      icon: Icon.News,
      href: `/-/account/${accountName}/create/project`,
      variant: 'primary',
      hide: !isMember,
      side: 'right',
    },
  ];

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
  ];

  if (!loading && !data?.account) {
    return (
      <Layout>
        <_404 
          message={"The account you are looking for doesn't seem to exist, no biggie click on the button below to create it!."}
          action={
            <Button onClick={() => router.push(`/-/create/account`)}>Create account</Button>
          }
        />
      </Layout>
    );
  };

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <Breadcrumbs items={breadcrumbs} />
        { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        }
      </Group>
      <div style={{ padding: 40 }}>
        <Group spacing={24} mb="xl" noWrap>
          <Item 
            name={accountName}
            label={meta?.name}
            image={meta?.image}
            large
          />
          <Actions actions={actions} />
        </Group>
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              <Tabs defaultValue="projects">
                <TabsListCard>
                  <Tabs.Tab value="projects">Projects</Tabs.Tab>
                  <Tabs.Tab value="members">Members</Tabs.Tab>
                  <Tabs.Tab value="activity">Activity</Tabs.Tab>
                </TabsListCard>
                <Tabs.Panel value="projects">
                  <CardGrid>
                    {projects.map((project: any, index: number) =>
                       <Metadata key={index} url={project.metaURI}>
                        {(data: any) => 
                          <NextLink
                            style={{ textDecoration: 'none' }}
                            href={`/${accountName}/${project.name}`}
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
                </Tabs.Panel>
                <Tabs.Panel value="members">
                  <Card>
                    <MemberList
                      label="Account Admin"
                      members={members.map((member: any) => member.id)}
                    />
                  </Card>
                </Tabs.Panel>
                <Tabs.Panel value="activity">
                  <Card>
                    <List>
                      {logs.map((log: any, index: number) => 
                        <Activity key={index} {...log} />,
                      )}
                    </List>
                  </Card>
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Account Info</Title>
                    <List>
                      <Group position="apart">
                        <Text>Members</Text>
                        <MemberStack size={28} members={members.map((member: any) => member.id)} />
                      </Group>
                      <Group position="apart">
                        <Text>Website</Text>
                        <Anchor href={meta?.external_url ?? ''}>
                          {meta?.external_url}
                        </Anchor>
                      </Group>
                    </List>
                  </Stack>
                </Card>
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
          }
        </Grid>
      </div>
    </Layout>
  );
};

export default AccountPage;