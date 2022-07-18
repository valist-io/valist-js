import type { NextPage } from 'next';
import { useContext } from 'react';
import { useNetwork } from 'wagmi';
import { useQuery, gql } from '@apollo/client';
import { NextLink } from '@mantine/next';
import { Activity, List } from '@valist/ui';
import { Layout } from '@/components/Layout';
import { AccountContext } from '@/components/AccountProvider';
import { ProjectCard } from '@/components/ProjectCard';
import { ActivityText } from '@/components/ActivityText';

import { 
  Title, 
  Group, 
  Stack,
} from '@mantine/core';

import { 
  Button, 
  Card, 
  MemberStack,
  Dashboard,
} from '@valist/ui';

const query = gql`
  query AccountProjects($accountId: String!){
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

const Index: NextPage = () => {
  const { chain } = useNetwork();
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
          {projects.map((project, index) =>
            <ProjectCard 
              key={index} 
              name={project.name} 
              metaURI={project.metaURI}
            /> 
          )}
        </Dashboard.Main>
        <Dashboard.Side>
          <Card>
            <Stack spacing={24}>
              <Title order={5}>Members</Title>
              <MemberStack members={members.map(member => member.id)} />
            </Stack>
          </Card>
          <Card>
            <Title order={5}>Recent Activity</Title>
            <List style={{ marginTop: 24 }}>
              {logs.slice(0, 4).map((log: any, index: number) => 
                <Activity key={index} sender={log.sender}>
                  <ActivityText {...log} />
                </Activity>
              )}
            </List>
          </Card>
        </Dashboard.Side>
      </Dashboard>
    </Layout>
  );
};

export default Index;