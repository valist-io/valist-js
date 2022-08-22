import type { NextPage } from 'next';
import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { NextLink } from '@mantine/next';
import { useMediaQuery } from '@mantine/hooks';
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
  MediaQuery,
} from '@mantine/core';

import {
  Button,
  Card,
  CardGrid,
  InfoButton,
  ProjectCard,
  MemberStack,
  List,
  NoProjects,
  Welcome,
  CheckboxList,
} from '@valist/ui';
import { ValistContext } from '@/components/ValistProvider';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const valist = useContext(ValistContext);
  const { account } = useContext(AccountContext);
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  const [onboarding, setOnboarding] = useState(false);
  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const { data, loading } = useQuery(query, { 
    variables: { accountId: account?.id ?? '' },
  });

  const projects = data?.account?.projects ?? [];
  const members = data?.account?.members ?? [];
  const logs = data?.account?.logs ?? [];

  const steps = [
    { label: 'Connect Wallet', checked: isConnected },
    { label: 'Create Account', checked: onboarding || !!account },
    { label: 'Create Project (Optional)', checked: false },
  ];

  if (!loading && (!account || onboarding)) {
    return (
      <Layout>
        <Grid>
          <Grid.Col md={4}>
            <CheckboxList items={steps} />
          </Grid.Col>
          <Grid.Col md={8}>
            { !isConnected && 
              <Welcome button={
                <Button onClick={openConnectModal}>Connect Wallet</Button>
              } />
            }
            { isConnected && !onboarding && 
              <CreateAccount afterCreate={() => setOnboarding(true)} />
            }
            { isConnected && onboarding && 
              <CreateProject afterCreate={() => setOnboarding(false)} />
            }
          </Grid.Col>
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout padding={0}>
      { showInfo &&
        <Group style={{ height: 66 }} position="right">
            <InfoButton 
              opened={infoOpened}
              onClick={() => setInfoOpened(!infoOpened)} 
            />
        </Group>
      }
      <div style={{ padding: 40 }}>
        <Group position="apart" mb="xl" style={{ marginBottom: 10 }}>
          <Title style={{ display: "block" }}>Hello & Welcome 👋🏽</Title>
          <NextLink href={`/-/account/${account?.name}/create/project`}>
            <Button>Create Project</Button>
          </NextLink>
        </Group>
        <Text style={{ display: "block", marginBottom: 32 }}>Explore your recently Published or Edited projects.</Text>
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              { projects.length === 0 && 
                <NoProjects action={() => router.push(`/-/account/${account?.name}/create/project`)} />
              }
              { projects.length !== 0 && 
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
              }
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
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
              </Stack>
            </Grid.Col>
          }
        </Grid>
      </div>
    </Layout>
  );
};

export default IndexPage;