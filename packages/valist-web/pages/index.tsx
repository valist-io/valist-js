import type { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { NextLink } from '@mantine/next';
import { useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { Activity } from '@/components/Activity';
import { CreateAccount } from '@/components/CreateAccount';
import { CreateProject } from '@/components/CreateProject';
import { ValistContext } from '@/components/ValistProvider';
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
  AccountSelect,
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

const IndexPage: NextPage = () => {
  const router = useRouter();
  const valist = useContext(ValistContext);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [onboarding, setOnboarding] = useState(false);
  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const { data, loading } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  // TODO
  const accountMeta = undefined;
  const [account, setAccount] = useState('');

  const accounts = Array.from((data?.user?.projects ?? [])
    .map(p => p.account)
    .concat(data?.user?.accounts ?? [])
    .reduce((s, a) => s.set(a.id, a), new Map())
    .values());

  const projects = Array.from((data?.user?.accounts ?? [])
    .flatMap(a => a.projects)
    .concat(data?.user?.projects ?? [])
    .filter(p => account === '' || p.account.name === account)
    .reduce((s, p) => s.set(p.id, p), new Map())
    .values());

  const members = Array.from(projects
    .flatMap(p => [...p.members, ...p.account.members])
    .reduce((s, m) => s.add(m.id), new Set())
    .values());

  const logs = []; // TODO

  const steps = [
    { label: 'Connect Wallet', checked: isConnected },
    { label: 'Create Account', checked: onboarding || accounts.length === 0 },
    { label: 'Create Project (Optional)', checked: false },
  ];

  if (!loading && (accounts.length === 0 || onboarding)) {
    return (
      <Layout hideNavbar>
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
      <Group mt={40} pl={40} position="apart">
        <AccountSelect
          name={account || 'All Accounts'}
          value={account}
          image={accountMeta?.image}
          href="/-/create/account"
          onChange={setAccount}
        >
          <AccountSelect.Option value="" name="All Accounts" />
          {accounts.map((acc, index) => 
            <Metadata key={index} url={acc.metaURI}>
              {(data: any) => (
                <AccountSelect.Option value={acc.name} name={acc.name} image={data?.image} />
              )}
            </Metadata>,
          )}
        </AccountSelect>
        { showInfo &&
          <InfoButton 
            opened={infoOpened}
            onClick={() => setInfoOpened(!infoOpened)} 
          />
        }
      </Group>
      <div style={{ padding: 40 }}>
        {/*<Group position="apart" mb="xl" style={{ marginBottom: 10 }}>
          <NextLink href={`/-/account/create/project`}>
            <Button>Create Project</Button>
          </NextLink>
        </Group>*/}
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              { projects.length === 0 && 
                <NoProjects action={() => router.push(`/-/account/${account?.name}/create/project`)} />
              }
              { projects.length !== 0 && 
                <CardGrid>
                  { projects.map((project: any, index: number) =>
                    <Metadata key={index} url={project.metaURI}>
                      {(data: any) =>
                        <NextLink
                          style={{ textDecoration: 'none' }}
                          href={`/${project.account?.name}/${project.name}`}
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
                    <MemberStack members={members} />
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