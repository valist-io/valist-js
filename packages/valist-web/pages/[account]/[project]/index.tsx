import type { NextPage } from 'next';
import { useState, useContext } from 'react';
import { useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useQuery, gql } from '@apollo/client';
import { NextLink } from '@mantine/next';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { ActivityText } from '@/components/ActivityText';
import { ActivityCard } from '@/components/ActivityCard';

import {
  Account,
  Anchor,
  Activity,
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
  Avatar,
  Title,
  Text,
  Group, 
  Stack,
} from '@mantine/core';

const query = gql`
  query ProjectPage($projectId: String!){
    project(id: $projectId){
      metaURI
      account {
        members {
          id
        }
      }
      releases(orderBy: blockTime, orderDirection: "desc") {
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

const ProjectPage: NextPage = () => {
  const { chain } = useNetwork();
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

  const logs = data?.project?.logs ?? [];
  const releases = data?.project?.releases ?? [];
  const latestRelease = releases.length > 0 ? releases[0] : undefined;

  const { data: projectMeta } = useSWRImmutable(data?.project?.metaURI);
  const { data: releaseMeta } = useSWRImmutable(latestRelease?.metaURI);

  return (
    <Layout>
      <Group mb="xl" position="apart">
        <Account
          name={projectName}
          label={projectMeta?.name}
          image={projectMeta?.image}
          large
        />
        { releaseMeta?.external_url &&
          <NextLink target="_blank" href={releaseMeta?.external_url}>
            <Button>Launch</Button>
          </NextLink>
        }
      </Group>
      <Dashboard>
        <Dashboard.Main>
          <Tabs active={active} onTabChange={setActive} withCard>
            <Tabs.Tab label="Readme">
              <Card>
                <Markdown children={projectMeta?.description} />
              </Card>
            </Tabs.Tab>
            <Tabs.Tab label="Versions">
              <Card>
                <List>
                  {releases.map((release: any, index: number) => 
                    <Group key={index} position="apart">
                      <Text>{release.name}</Text>
                      <a target="_blank" href={release.metaURI}>view metadata</a>
                    </Group>
                  )}
                </List>
              </Card>
            </Tabs.Tab>
            <Tabs.Tab label="Activity">
              <Card>
                <List>
                  {logs.map((log: any, index: number) => 
                    <Activity key={index} sender={log.sender}>
                      <ActivityText {...log} />
                    </Activity>
                  )}
                </List>
              </Card>
            </Tabs.Tab>
            <Tabs.Tab label="Members">
              <Card>
                <List>
                  <MemberList
                    label="Account Admin"
                    members={accountMembers.map(member => member.id)}
                  />
                  <MemberList
                    label="Project Admin"
                    members={projectMembers.map(member => member.id)}
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
                  <MemberStack size={28} members={members.map(member => member.id)} />
                </Group>
                <Group position="apart">
                  <Text>Website</Text>
                  <Anchor>{projectMeta?.external_url}</Anchor>
                </Group>
              </List>
            </Stack>
          </Card>
          <ActivityCard logs={logs} />
        </Dashboard.Side>
      </Dashboard>
    </Layout>
  );
};

export default ProjectPage;