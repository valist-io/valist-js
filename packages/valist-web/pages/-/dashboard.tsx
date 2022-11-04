import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { Activity } from '@/components/Activity';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateAccount } from '@/components/CreateAccount';
import { CreateProject } from '@/components/CreateProject';
import { useValist } from '@/utils/valist';
import { useDashboard } from '@/utils/dashboard';

import { 
  Anchor,
  Avatar,
  Grid,
  Group,
  Stack,
  Text,
  Title, 
} from '@mantine/core';

import {
  AccountSelect,
  Actions,
  Action,
  Button,
  Card,
  CardGrid,
  InfoButton,
  MemberStack,
  List,
  NoProjects,
  Welcome,
  CheckboxList,
} from '@valist/ui';
import { getAccounts, setAccount } from '@valist/ui/dist/components/AccountSelect';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const valist = useValist();

  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [onboarding, setOnboarding] = useState(false);
  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const [accountName, setAccountName] = useState('');
  const { accounts, projects, members, logs, loading } = useDashboard(accountName);
  
  const handleAccountChange = (name: string) => {
    const accountByAddress = getAccounts();
    if (address) setAccount(name, address, accountByAddress);
    setAccountName(name);
  };

  useEffect(() => {
    const accountByAddress = getAccounts();
    if (address) setAccountName(accountByAddress[address]);
  }, [address]);

  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  const actions: Action[] = [
    {
      label: 'Settings', 
      icon: Icon.Settings, 
      href: `/-/account/${accountName}/settings`,
      variant: 'subtle',
      side: 'right',
    },
    {
      label: 'New Project',
      icon: Icon.News,
      href: `/-/account/${accountName}/create/project`,
      variant: 'primary',
      side: 'right',
    },
  ];

  const steps = [
    { label: 'Connect Wallet', checked: isConnected },
    { label: 'Create Account', checked: isConnected && (onboarding || accounts.length !== 0) },
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
          name={accountName || 'All Accounts'}
          value={accountName}
          image={accountMeta?.image}
          href="/-/create/account"
          onChange={handleAccountChange}
        >
          <AccountSelect.Option value="" name="All Accounts" />
          {accounts.map((acc: any, index: number) => 
            <Metadata key={index} url={acc.metaURI}>
              {(data: any) => ( <AccountSelect.Option value={acc.name} name={acc.name} image={data?.image} /> )}
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
        { accountName !== '' &&
          <Group spacing={24} mb="xl" align="stretch" noWrap>
            <Avatar 
              radius="md"
              size={92} 
              src={accountMeta?.image} 
            />
            <Stack justify="space-between">
              <Stack spacing={0}>
                <Title order={3}>{accountName}</Title>
                <Text color="gray.3">{accountMeta?.name}</Text>
              </Stack>
              <Group spacing={5}>
                <Icon.Users size={20} color="#9B9BB1" />
                <Text color="gray.3" mr={13}>
                  {members.length} {members.length == 1 ? 'Member' : 'Members'}
                </Text>
                <Icon.World size={20} color="#9B9BB1" />
                {accountMeta?.external_url && <Anchor color="gray.3" target="_blank" href={accountMeta?.external_url}>
                  Website
                </Anchor>}
              </Group>
            </Stack>
            <Actions actions={actions} />
          </Group>
        }
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
              { projects.length === 0 && 
                <NoProjects action={() => router.push(`/-/account/${accountName}/create/project`)} />
              }
              { projects.length !== 0 && 
                <CardGrid>
                  { projects.map((project: any, index: number) =>
                    <ProjectCard 
                      key={index}
                      name={project.name}
                      metaURI={project.metaURI}
                      href={`/${project.account?.name}/${project.name}`}
                    />,
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