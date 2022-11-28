import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { Activity } from '@/components/Activity';
import { ProjectCard } from '@/components/ProjectCard';
import { CreateAccount } from '@/components/CreateAccount';
import { CreateProject } from '@/components/CreateProject';
import { useDashboard } from '@/utils/dashboard';

import { 
  Anchor,
  Avatar,
  Grid,
  Group,
  Stack,
  Stepper,
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
} from '@valist/ui';

const IndexPage: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();

  const [accountNames, setAccountNames] = useLocalStorage<Record<string, string>>({
    key: 'accountNames',
    defaultValue: {},
  });

  const [onboardingSkips, setOnboardingSkips] = useLocalStorage<Record<string, boolean>>({ 
    key: 'onboardingSkips',
    defaultValue: {}, 
  });

  const setAccountName = (name: string) => setAccountNames(current => ({ ...current, [`${address}`]: name }));
  const skipOnboarding = () => setOnboardingSkips(current => ({ ...current, [`${address}`]: true }));

  const [step, setStep] = useState(0);
  const [infoOpened, setInfoOpened] = useState(false);

  const showInfo = useMediaQuery('(max-width: 1400px)', false);
  const isMobile = useMediaQuery('(max-width: 992px)', false);

  const accountName = address ? accountNames[address] : '';
  const onboarding = address ? onboardingSkips[address] : false;

  const { accounts, projects, members, logs, loading } = useDashboard(accountName);
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

  // update stepper
  useEffect(() => {
    if (!address) {
      setStep(0);
    } else if (accounts.length === 0) {
      setStep(1);
    } else if (projects.length === 0) {
      setStep(2);
    } else {
      setStep(3);
    }
  }, [address, accounts.length, projects.length]);

  if (!loading && step < 3 && !onboarding) {
    return (
      <Layout hideNavbar>
        <Grid>
          <Grid.Col md={3} pr={40} mb={40}>
            <Stack align={isMobile ? 'flex-start' : 'flex-end'}>
              <Stepper active={step} orientation="vertical">
                <Stepper.Step label="Step 1" description="Connect Wallet" />
                <Stepper.Step label="Step 2" description="Create Account" />
                <Stepper.Step label="Step 3" description="Create Project" />
              </Stepper>
              {accounts.length > 0 && 
                <Button
                  disabled={step === 0}
                  variant="subtle"
                  onClick={skipOnboarding}
                >
                  Skip Onboarding
                </Button>
              }
            </Stack>
          </Grid.Col>
          <Grid.Col md={9}>
            { step === 0 && <Welcome /> }
            { step === 1 && <CreateAccount onboard={true} /> }
            { step === 2 && <CreateProject onboard={true} account={accountName} /> }
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
          onChange={setAccountName}
        >
          <AccountSelect.Option value="" name="All Accounts" />
          {accounts.map((acc: any, index: number) => 
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
        { accountName &&
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