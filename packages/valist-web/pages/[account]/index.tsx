import type { NextPage } from 'next';
import { useState, useContext } from 'react';
import { useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { NextLink } from '@mantine/next';
import { useQuery, gql } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { AccountContext } from '@/components/AccountProvider';
import { Metadata } from '@/components/Metadata';
import { ValistContext } from '@/components/ValistProvider';
import { Activity } from '@/components/Activity';

import { 
  Anchor,
  Title,
  Text,
  Group, 
  Stack,
} from '@mantine/core';

import {
  Account,
  Card,
  CardGrid,
  Dashboard,
  MemberList,
  MemberStack,
  ProjectCard,
  List,
  Tabs,
} from '@valist/ui';

const query = gql`
  query AccountPage($accountId: String!){
    account(id: $accountId){
      metaURI
      projects {
        id
        name
        metaURI
      }
      members {
        id
      }
      logs(orderBy: blockTime, orderDirection: "desc"){
        id
        type
        sender
        member
        account {
          name
        }
        project {
          name
        }
        release {
          name
        }
      }
    }
  }
`;

const AccountPage: NextPage = () => {
  const { chain } = useNetwork();
  const router = useRouter();
  const valist = useContext(ValistContext);
  const [active, setActive] = useState(0);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 0, accountName);

  const { data } = useQuery(query, { 
    variables: { accountId },
  });

  const projects = data?.account?.projects ?? [];
  const members = data?.account?.members ?? [];
  const logs = data?.account?.logs ?? [];

  const { data: meta } = useSWRImmutable(data?.account?.metaURI);

  return (
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
      ]}
    >
      <Group mb="xl">
        <Account 
          name={accountName}
          label={meta?.name}
          image={meta?.image} 
          large 
        />
      </Group>
      <Dashboard>
        <Dashboard.Main>
          <Tabs active={active} onTabChange={setActive} variant="card">
            <Tabs.Tab label="Projects">
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
            </Tabs.Tab>
            <Tabs.Tab label="Members">
              <Card>
                <MemberList
                  label="Account Admin"
                  members={members.map((member: any) => member.id)}
                />
              </Card>
            </Tabs.Tab>
            <Tabs.Tab label="Activity">
              <Card>
                <List>
                  {logs.map((log: any, index: number) => 
                    <Activity key={index} {...log} />,
                  )}
                </List>
              </Card>
            </Tabs.Tab>
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