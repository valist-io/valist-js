import type { NextPage } from 'next';
import { useState, useContext, Fragment } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useQuery } from '@apollo/client';
import { NextLink } from '@mantine/next';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { Activity } from '@/components/Activity';
import { Purchase } from '@/components/Purchase';
import query from '@/graphql/ProjectPage.graphql';
import { Gallery, _404 } from '@valist/ui';

import {
  Account,
  Button,
  Dashboard,
  Card,
  List,
  Markdown,
  MemberList,
  MemberStack,
  TabsListCard,
} from '@valist/ui';

import { 
  Anchor,
  Avatar,
  Title,
  Text,
  Group, 
  Stack,
  Tabs,
} from '@mantine/core';

const ProjectPage: NextPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const router = useRouter();
  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 0, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data, loading } = useQuery(query, { variables: { projectId } });

  const accountMembers = data?.project?.account?.members ?? [];
  const projectMembers = data?.project?.members ?? [];
  const members = [...accountMembers, ...projectMembers];

  const isAccountMember = accountMembers.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const isProjectMember = projectMembers.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const isMember = isAccountMember || isProjectMember;

  const logs = data?.project?.logs ?? [];
  const releases = data?.project?.releases ?? [];
  const latestRelease = data?.project?.releases?.[0];

  const { data: projectMeta } = useSWRImmutable(data?.project?.metaURI);
  const { data: releaseMeta } = useSWRImmutable(latestRelease?.metaURI);

  if (!loading && !data?.project) {
    return (
      <Layout>
        <_404 
          message={"The project you are looking for doesn't seem to exist, no biggie, click on the button below to create it!"}
          action={
            <Button onClick={() => router.push(`/-/account/${accountName}/create/project`)}>Create project</Button>
          }
        />
      </Layout>
    );
  };

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
          { isAccountMember &&
            <NextLink href={`/-/account/${accountName}/project/${projectName}/pricing`}>
              <Button variant="secondary">Pricing</Button>
            </NextLink>
          }
          { isMember &&
            <>
              <NextLink href={`/-/account/${accountName}/project/${projectName}/settings`}>
                <Button variant="subtle">Settings</Button>
              </NextLink>
              <NextLink href={`/-/account/${accountName}/project/${projectName}/create/release`}>
                <Button>New Release</Button>
              </NextLink>
            </>
          }
        </Group>
      </Group>
      <Dashboard>
        <Dashboard.Main>
          <Tabs defaultValue="readme">
            <TabsListCard>
              <Tabs.Tab value="readme">Readme</Tabs.Tab>
              <Tabs.Tab value="versions">Versions</Tabs.Tab>
              <Tabs.Tab value="activity">Activity</Tabs.Tab>
              <Tabs.Tab value="members">Members</Tabs.Tab>
            </TabsListCard>
            <Tabs.Panel value="readme">
              <Stack spacing={24}>
                { (projectMeta?.gallery && projectMeta?.gallery?.length !== 0) &&
                  <Gallery assets={projectMeta?.gallery} />
                }
                { releaseMeta &&
                  <Purchase 
                    projectId={projectId}
                    name={projectMeta?.name ?? projectName}
                    href={releaseMeta.external_url ?? ''}
                  />
                }
                <Card>                
                  <Markdown>
                    {projectMeta?.description}
                  </Markdown>
                </Card>
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="versions">
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
            </Tabs.Panel>
            <Tabs.Panel value="activity">
              <Card>
                <List>
                  {logs.map((log: any, index: number) => 
                    <Activity key={index} {...log} />,
                  )}
                </List>
              </Card>
            </Tabs.Panel>
            <Tabs.Panel value="members">
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
            </Tabs.Panel>
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