import type { NextPage } from 'next';
import { useState, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useQuery } from '@apollo/client';
import { NextLink } from '@mantine/next';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { Activity } from '@/components/Activity';
import query from '@/graphql/ProjectPage.graphql';

import {
  Account,
  Button,
  Dashboard,
  Tabs,
  Card,
  List,
  Markdown,
  MemberList,
  MemberStack,
} from '@valist/ui';

import { 
  Anchor,
  Avatar,
  Title,
  Text,
  Group, 
  Stack,
} from '@mantine/core';

const ProjectPage: NextPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const router = useRouter();
  const valist = useContext(ValistContext);
  const [active, setActive] = useState(0);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 0, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { 
    variables: { projectId },
  });

  const accountMembers = data?.project?.account?.members ?? [];
  const projectMembers = data?.project?.members ?? [];
  const members = [...accountMembers, ...projectMembers];

  const isMember = !!members.find(
    other => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const logs = data?.project?.logs ?? [];
  const releases = data?.project?.releases ?? [];
  const latestRelease = data?.project?.releases?.[0];

  const { data: projectMeta } = useSWRImmutable(data?.project?.metaURI);
  const { data: releaseMeta } = useSWRImmutable(latestRelease?.metaURI);

  return (
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
        { title: projectName, href: `/${accountName}/${projectName}` },
      ]}
    >
      <Group mb="xl" position="apart">
        <Account
          name={projectName}
          label={projectMeta?.name}
          image={projectMeta?.image}
          large
        />
        <Group>
          { isMember &&
            <>
              <NextLink href={`/-/account/${accountName}/project/${projectName}/settings`}>
                <Button variant="secondary">Edit</Button>
              </NextLink>
              <NextLink href={`/-/account/${accountName}/project/${projectName}/create/release`}>
                <Button variant="subtle">Publish</Button>
              </NextLink>
            </>
          }
          { releaseMeta?.external_url &&
            <NextLink target="_blank" href={releaseMeta?.external_url}>
              <Button>Launch</Button>
            </NextLink>
          }
        </Group>
      </Group>
      <Dashboard>
        <Dashboard.Main>
          <Tabs active={active} onTabChange={setActive} variant="card">
            <Tabs.Tab label="Readme">
              <Card>
                <Markdown>
                  {projectMeta?.description}
                </Markdown>
              </Card>
            </Tabs.Tab>
            <Tabs.Tab label="Versions">
              <Card>
                <List>
                  {releases.map((release: any, index: number) => 
                    <Group key={index} position="apart">
                      <Text>{release.name}</Text>
                      <a target="_blank" href={release.metaURI} rel="noreferrer">view metadata</a>
                    </Group>,
                  )}
                </List>
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
            <Tabs.Tab label="Members">
              <Card>
                <List>
                  <MemberList
                    label="Account Admin"
                    members={accountMembers.map((member: any) => member.id)}
                  />
                  <MemberList
                    label="Project Admin"
                    members={projectMembers.map((member: any) => member.id)}
                  />
                </List>
              </Card>
            </Tabs.Tab>
          </Tabs>
        </Dashboard.Main>
        <Dashboard.Side>
          <Card>
            <Stack spacing={24}>
              <Title order={5}>Project Info</Title>
              <List>
                <Group position="apart">
                  <Text>Downloads</Text>
                  <Text>0</Text>
                </Group>
                <Group position="apart">
                  <Text>Members</Text>
                  <MemberStack 
                    size={28} 
                    members={members.map(member => member.id)} 
                  />
                </Group>
                <Group position="apart">
                  <Text>Version</Text>
                  <Text>{latestRelease?.name}</Text>
                </Group>
                <Group position="apart">
                  <Text>Website</Text>
                  <Anchor href={projectMeta?.external_url ?? ''}>
                    {projectMeta?.external_url}
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

export default ProjectPage;