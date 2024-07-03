import type { NextPage } from 'next';
import { Capacitor } from '@capacitor/core';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import * as Icon from 'tabler-icons-react';
import { useQuery } from '@apollo/client';
import { useMediaQuery } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
import { DonationModal } from '@/components/DonationModal';
import query from '@/graphql/ProjectPage.graphql';

import {
  _404,
  Actions,
  Action,
  Button,
  Breadcrumbs,
  Card,
  InfoButton,
  Item,
  Gallery,
  List,
  Markdown,
  MemberList,
  MemberStack,
  TabsListCard,
} from '@valist/ui';

import {
  Anchor,
  Title,
  Text,
  Group,
  Stack,
  Tabs,
  Grid,
  Tooltip,
} from '@mantine/core';
import { isReleaseMetaV2, platformNames, ProjectMeta, ReleaseMeta, ReleaseMetaV1, SupportedPlatform, supportedPlatforms } from '@valist/sdk';

const platformIcons: Record<SupportedPlatform , JSX.Element> = {
  'web': <Icon.World />,
  'darwin_amd64': <Icon.BrandApple />,
  'darwin_arm64': <Icon.BrandApple />,
  'android_arm64': <Icon.BrandAndroid />,
  'linux_amd64': <Icon.BrandUbuntu />,
  'linux_arm64': <Icon.BrandUbuntu />,
  'windows_amd64': <Icon.BrandWindows />,
  'windows_arm64': <Icon.BrandWindows />,
};

const ProjectPage: NextPage = () => {
  const chainId = getChainId();
  const { address } = useAccount();
  const isCap = Capacitor.getPlatform() !== 'web';

  const router = useRouter();
  const valist = useValist();

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data, loading } = useQuery(query, { 
    variables: { projectId },
  });

  const accountMembers = data?.project?.account?.members ?? [];
  const projectMembers = data?.project?.members ?? [];
  const members = [...accountMembers, ...projectMembers];

  const logs = data?.project?.logs || [];
  const releases = data?.project?.releases || [];
  const latestRelease = data?.project?.releases?.[0];

  const { data: projectMeta } = useSWRImmutable<ProjectMeta>(data?.project?.metaURI);
  const { data: releaseMeta } = useSWRImmutable<ReleaseMeta | ReleaseMetaV1>(latestRelease?.metaURI);

  const [infoOpened, setInfoOpened] = useState(false);
  const showInfo = useMediaQuery('(max-width: 1400px)', false);

  const [donationOpen, setDonationOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  // update balance when address or projectId changes
  useEffect(() => {
    if (address) {
      valist.getProductBalance(address, projectId)
        .catch(_err => setBalance(0))
        .then(value => setBalance(value?.toNumber() ?? 0));  
    }
  }, [address, projectId]);

  const isPriced = !!data?.product?.currencies?.find(
    (curr: any) => curr.price !== '0',
  );

  const isAccountMember = !!accountMembers.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const isProjectMember = !!projectMembers.find(
    (other: any) => other.id.toLowerCase() === address?.toLowerCase(),
  );

  const actions: Action[] = [
    {
      label: 'Settings', 
      icon: Icon.Settings, 
      href: `/-/account/${accountName}/project/${projectName}/settings`, 
      hide: !(isAccountMember || isProjectMember),
      side: 'left',
    },
    {
      label: 'Pricing', 
      icon: Icon.Tag, 
      href: `/-/account/${accountName}/project/${projectName}/pricing`, 
      hide: !(isAccountMember || isProjectMember),
      side: 'left',
    },
    {
      label: 'Deployments', 
      icon: Icon.Rocket, 
      href: `/-/account/${accountName}/project/${projectName}/deployments`, 
      hide: !(isAccountMember || isProjectMember),
      side: 'left',
    },
    {
      label: 'New Release',
      icon: Icon.News,
      href: `/-/account/${accountName}/project/${projectName}/create/release`,
      variant: 'subtle',
      hide: !(isAccountMember || isProjectMember),
      side: 'right',
    },
    {
      label: 'Purchase',
      icon: Icon.ShoppingCart,
      href: `/-/account/${accountName}/project/${projectName}/checkout`,
      variant: 'primary',
      hide: !(isPriced && balance === 0 && !isCap),
      side: 'right',
    },
    {
      label: (projectMeta?.type === 'native' || projectMeta?.type === 'web') ? 'Launch' : 'Download',
      icon: Icon.Rocket,
      action: async () => {
        if (projectMeta?.prompt_donation) {
          setDonationOpen(true);
        } else {
          window.open(releaseMeta?.external_url);
          await fetch(`/api/stats/${accountName}/${projectName}/${latestRelease?.name}`, { method: 'PUT' });
        }
      },
      hide: (isPriced && balance === 0) || !(projectMeta && (releases.length !== 0 || projectMeta?.launch_external)),
      variant: 'primary',
      side: 'right',
    },
  ];

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
  ];

  let platforms: { icon: JSX.Element, name: string, url: string }[] = [
    {
      icon: <Icon.FileUnknown/>,
      name: 'Unknown',
      url: releaseMeta?.external_url || '',
    },
  ];

  if (releaseMeta) {
    if (isReleaseMetaV2(releaseMeta)) {
      if (releaseMeta.platforms) { // v2 always has platform field
        platforms = [];
        Object.keys(releaseMeta.platforms).forEach((platform) => {
          if (releaseMeta.platforms) {
            platforms.push({
              icon: platformIcons[platform as SupportedPlatform],
              name: platformNames[platform as SupportedPlatform],
              url: releaseMeta?.platforms[platform as SupportedPlatform]?.external_url || '',
            });
          }
        });
      }
    } else {
      if (releaseMeta.install) { // if native type
        platforms = [];
        Object.keys(releaseMeta.install).forEach((platform) => {
          if (releaseMeta.install) {
            platforms.push({
              icon: platformIcons[platform as SupportedPlatform],
              name: platformNames[platform as SupportedPlatform],
              url: `${releaseMeta.external_url}/${releaseMeta?.install[platform as SupportedPlatform]}`,
            });
          }
        });
      } else { // if web type
        platforms = [
          {
            icon: <Icon.World/>,
            name: platformNames['web'],
            url: releaseMeta?.external_url || '',
          },
        ];
      }
    }
  }

  if (!loading && !data?.project) {
    return (
      <Layout title={`404 not found`}>
        <_404 
          message={"The project you are looking for doesn't seem to exist -- no biggie, click on the button below to create it!"}
          action={
            <Button onClick={() => router.push(`/-/account/${accountName}/create/project`)}>Create project</Button>
          }
        />
      </Layout>
    );
  };

  return (
    <Layout padding={0} title={`${accountName}/${projectName}`}>
      <DonationModal 
        opened={donationOpen}
        accountName={accountName}
        projectName={projectName}
        releaseName={latestRelease?.name}
        projectType={projectMeta?.type || 'web'}
        releaseURL={releaseMeta?.external_url || ''}
        donationAddress={projectMeta?.donation_address || ''}
        onClose={() => setDonationOpen(false)}       
      />
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
        <Group spacing={24} mb="xl" noWrap>
          <Item 
            name={projectMeta?.name || projectName}
            label={projectMeta?.short_description}
            image={projectMeta?.image}
            large
          />
          <Actions actions={actions} />
        </Group>
        <Grid>
          { (!showInfo || !infoOpened) &&
            <Grid.Col xl={8}>
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
            </Grid.Col>
          }
          { (!showInfo || infoOpened) &&
            <Grid.Col xl={4}>
              <Stack spacing={24}>
                <Card>
                  <Stack spacing={24}>
                    <Title order={5}>Project Info</Title>
                    <List>
                      {/* <Group position="apart">
                        <Text>Downloads</Text>
                        <Text>0</Text>
                      </Group> */}
                      <Group position="apart">
                        <Text>Valist Link (Beta)</Text>
                        <Anchor target="_blank" href={`https://${projectName}--${accountName}.on.valist.io`}>
                          https://{projectName}--{accountName}.on.valist.io
                        </Anchor>
                      </Group>
                      {releaseMeta?.external_url &&
                        <Group position="apart">
                          <Text>IPFS Link</Text>
                          <Anchor target="_blank" style={{ maxWidth: 300, overflow: 'hidden' }} href={releaseMeta?.external_url}>
                            {releaseMeta?.external_url}
                          </Anchor>
                        </Group>
                      }
                      <Group position="apart">
                        <Text>Members</Text>
                        <MemberStack 
                          size={28} 
                          members={members.map(member => member.id)} 
                        />
                      </Group>
                      <Group style={{ overflow: 'hidden' }} position="apart">
                        <Text>Version</Text>
                        <Text>{latestRelease?.name}</Text>
                      </Group>
                      <Group position="apart">
                        <Text>Platforms</Text>
                        <div style={{ display: 'flex' }}>
                          {platforms.map((platform) => (
                            <div key={platform.url}>
                              {platform.url &&
                                <Tooltip label={platform.name}>
                                  {/* requires wrapping div */}
                                  <div>
                                    <a target="_blank" rel="noreferrer" href={platform.url} style={{ color: 'inherit', textDecoration: 'none' }}>
                                      {platform.icon}
                                    </a>
                                  </div>
                                </Tooltip>
                              }
                            </div>
                          ))}
                        </div>
                      </Group>
                      {projectMeta?.external_url &&
                        <Group position="apart">
                          <Text>Website</Text>
                          <Anchor target="_blank" href={projectMeta?.external_url}>
                            {projectMeta?.external_url}
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

export default ProjectPage;