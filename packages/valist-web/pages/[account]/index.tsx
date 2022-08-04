import type { NextPage } from 'next';
import { useState, useContext } from 'react';
import { useNetwork, useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { NextLink } from '@mantine/next';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { AccountContext } from '@/components/AccountProvider';
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
} from '@mantine/core';

import {
  Account,
  Button,
  Card,
  CardGrid,
  Dashboard,
  MemberList,
  MemberStack,
  ProjectCard,
  List,
  TabsListCard,
  _404,
} from '@valist/ui';

const AccountPage: NextPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const router = useRouter();
  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 137, accountName);

  const { data, loading } = useQuery(query, { 
    variables: { accountId },
  });

  const projects = data?.account?.projects ?? [];
  const members = data?.account?.members ?? [];
  const logs = data?.account?.logs ?? [];

  const isMember = !!members.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const { data: meta } = useSWRImmutable(data?.account?.metaURI);

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
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
      ]}
    >
      <Group mb="xl" position="apart">
        <Account 
          name={accountName}
          label={meta?.name}
          image={meta?.image} 
          large 
        />
        { isMember &&
          <Group>
            <NextLink href={`/-/account/${accountName}/settings`}>
              <Button variant="subtle">Settings</Button>
            </NextLink>
            <NextLink href={`/-/account/${accountName}/create/project`}>
              <Button>New Project</Button>
            </NextLink>
          </Group>
        }
      </Group>
      <Dashboard>
        <Dashboard.Main>
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
        </Dashboard.Main>
        <Dashboard.Side>
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
        </Dashboard.Side>
      </Dashboard>
    </Layout>
  );
};

export default AccountPage;