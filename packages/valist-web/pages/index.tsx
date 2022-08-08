import type { NextPage } from 'next';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { NextLink } from '@mantine/next';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { AccountContext } from '@/components/AccountProvider';
import { Activity } from '@/components/Activity';
import { CreateAccount } from '@/components/CreateAccount';
import { CreateProject } from '@/components/CreateProject';
import query from '@/graphql/DashboardPage.graphql';

import { 
  Title, 
  Group,
  Stack,
  Grid,
  Text,
} from '@mantine/core';

import {
  Button,
  Card,
  CardGrid,
  Dashboard,
  ProjectCard,
  MemberStack,
  List,
  NoProjects,
  Welcome,
  CheckboxList,
} from '@valist/ui';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { account } = useContext(AccountContext);
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const [continueOnboarding, setContinueOnboarding] = useState<boolean>(false);

  const { data, loading } = useQuery(query, { 
    variables: { accountId: account?.id ?? '' },
  });

  const projects = data?.account?.projects ?? [];
  const members = data?.account?.members ?? [];
  const logs = data?.account?.logs ?? [];

  const steps = [
    { label: 'Connect Wallet', checked: isConnected },
    { label: 'Create Account', checked: continueOnboarding || (account !== undefined) },
    { label: 'Create Project (Optional)', checked: false },
  ];

  return (
    <Layout>
      {account && !continueOnboarding &&
        <>
          <Group position="apart" mb="xl" style={{ marginBottom: 10 }}>
            <Title style={{ display: "block" }}>Hello & Welcome 👋🏽</Title>
            <NextLink href={`/-/account/${account?.name}/create/project`}>
              <Button>Create Project</Button>
            </NextLink>
          </Group>
          <Text style={{ display: "block", marginBottom: 32 }}>Explore your recently Published or Edited projects.</Text>
        </>
      }
      <Dashboard>
        <Dashboard.Main>
          {(!loading && !account || continueOnboarding) &&
            <Grid>
              <Grid.Col md={4}>
                <CheckboxList items={steps} />
              </Grid.Col>
              <Grid.Col md={8}>
                {!isConnected && 
                  <Welcome button={
                    <Button onClick={openConnectModal}>Connect Wallet</Button>
                  } />
                }
                {isConnected && !continueOnboarding && 
                  <CreateAccount afterCreate={() => setContinueOnboarding(true)} />
                }
                {isConnected && continueOnboarding && 
                  <CreateProject afterCreate={() => setContinueOnboarding(false)} />
                }
              </Grid.Col>
            </Grid>
          }

          {(!loading && account && !continueOnboarding && projects.length === 0) && 
             <NoProjects action={() => router.push(`/-/account/${account?.name}/create/project`)} />
          }

          {projects && <CardGrid>
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
          </CardGrid>}
        </Dashboard.Main>
        {account && !continueOnboarding && <Dashboard.Side>
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
        </Dashboard.Side>}
      </Dashboard>
    </Layout>
  );
};

export default IndexPage;