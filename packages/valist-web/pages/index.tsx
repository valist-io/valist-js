import type { NextPage } from 'next';
import { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { NextLink } from '@mantine/next';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { AccountContext } from '@/components/AccountProvider';
import { Activity } from '@/components/Activity';

import { 
  Title, 
  Group,
  Stack,
} from '@mantine/core';

import {
  Button,
  Card,
  CardGrid,
  Dashboard,
  ProjectCard,
  MemberStack,
  List,
} from '@valist/ui';

const query = gql`
  query IndexPage($accountId: String!){
    account(id: $accountId){
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

const IndexPage: NextPage = () => {
  const { account } = useContext(AccountContext);

  const { data } = useQuery(query, { 
    variables: { accountId: account?.id },
  });

  const projects = data?.account?.projects ?? [];
  const members = data?.account?.members ?? [];
  const logs = data?.account?.logs ?? [];

  return (
    <Layout>
      <Group position="apart" mb="xl">
        <Title>Dashboard</Title>
        <NextLink href="/-/create/project">
          <Button>Create Project</Button>
        </NextLink>
      </Group>
      <Dashboard>
        <Dashboard.Main>
          <CardGrid>
            {projects.map((project: any, index: number) =>
               <Metadata key={index} url={project.metaURI}>
                {(data: any) =>
                  <NextLink
                    style={{ textDecoration: 'none' }}
                    href={`/${account?.name}/${project.name}`}
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
        </Dashboard.Main>
        <Dashboard.Side>
          <Card>
            <Stack spacing={24}>
              <Title order={5}>Members</Title>
              <MemberStack members={members.map((member: any) => member.id)} />
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

export default IndexPage;