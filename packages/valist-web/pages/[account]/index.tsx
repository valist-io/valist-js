import type { NextPage } from 'next';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Metadata } from '@/components/Metadata';
import { Activity } from '@/components/Activity';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
import query from '@/graphql/AccountPage.graphql';

import { 
  Anchor,
  Title,
  Text,
  Group, 
  Stack,
  Grid,
  Avatar,
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
  MemberStack,
  ProjectCard,
  List,
} from '@valist/ui';

const AccountPage: NextPage = () => {
  const chainId = getChainId();
  const { address } = useAccount();

  const router = useRouter();
  const valist = useValist();

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const { data, loading } = useQuery(query, { 
    variables: { accountId },
    pollInterval: 5000,
  });
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
      variant: 'subtle',
      hide: !isMember,
      side: 'left',
    },
    {
      label: 'New Project',
      icon: Icon.News,
      href: `/-/account/${accountName}/create/project`,
      variant: 'primary',
      hide: !isMember,
      side: 'left',
    },
  ];

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
  ];

  if (!loading && !data?.account) {
    return (
      <Layout title={`404 not found`}>
        <_404 
          message={"The account you are looking for doesn't seem to exist, no biggie click on the button below to create it!"}
          action={
            <Button onClick={() => router.push(`/-/create/account`)}>Create account</Button>
          }
        />
      </Layout>
    );
  };

  return (
    <Layout padding={0} title={`${accountName}`}>
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
        <Group spacing={24} mb="xl" align="stretch" noWrap>
          <Avatar 
            radius="md"
            size={92} 
            src={meta?.image} 
          />
          <Stack justify="space-between">
            <Stack spacing={0}>
              <Title order={3}>{accountName}</Title>
              <Text color="gray.3">{meta?.name}</Text>
            </Stack>
            <Group spacing={5}>
              <Icon.Users size={20} color="#9B9BB1" />
              <Text color="gray.3" mr={13}>
                {members.length} {members.length == 1 ? 'Member' : 'Members'}
              </Text>
              <Icon.World size={20} color="#9B9BB1" />
              {meta?.external_url && 
                <Anchor color="gray.3" target="_blank" href={meta?.external_url}>
                  Website
                </Anchor>
              }
            </Group>
          </Stack>
          <Actions actions={actions} />
        </Group>
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
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
                          description={data?.short_description} 
                          image={data?.image} 
                        />
                      </NextLink>
                    }
                  </Metadata>,
                )}
              </CardGrid>
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
                      {meta?.external_url &&
                        <Group position="apart">
                          <Text>Website</Text>
                          <Anchor target="_blank" href={meta?.external_url}>
                            {meta?.external_url}
                          </Anchor>
                        </Group>
                      }
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