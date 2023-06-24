import type { NextPage } from 'next';
import React, { useState, useEffect, useRef } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import { useForm, zodResolver } from '@mantine/form';
import { Layout } from '@/components/Layout';
import { AddressInput } from '@/components/AddressInput';
import { defaultTags, defaultTypes } from '@/forms/common';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
import query from '@/graphql/UpdateProjectPage.graphql';

import { 
  schema,
  FormValues,
  updateProject,
  addProjectMember,
  removeProjectMember,
} from '@/forms/update-project';

import {
  Group,
  Text,
  Title,
  Stack,
  List,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Tabs,
  Checkbox,
  Flex,
  Card,
} from '@mantine/core';

import { 
  Button,
  Breadcrumbs,
  ImageInput,
  MemberList,
  GalleryInput,
  _404,
  Activity,
} from '@valist/ui';
import { ProjectMeta, GalleryMeta } from '@valist/sdk';
import { getYouTubeEmbedURL } from '@valist/ui/dist/components/Gallery';
import { NetworkInput } from '@/components/NetworkInput';

const Project: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();
  const valist = useValist();
  
  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data, loading:gqLoading } = useQuery(query, { variables: { projectId } });
  const { data: meta } = useSWRImmutable<ProjectMeta>(data?.project?.metaURI);
  const [oldMeta, setOldMeta] = useState<ProjectMeta>({});

  const accountMembers = data?.project?.account?.members ?? [];
  const projectMembers = data?.project?.members ?? [];

  const logs = data?.project?.logs || [];
  const releases = data?.project?.releases || [];

  const [activeTab, setActiveTab] = useState<string | null>();

  // form values
  const openRef = useRef<() => void>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const [image, setImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File | undefined>();

  const [mainCapsule, setMainCapsule] = useState<string>('');
  const [newMainCapsule, setNewMainCapsule] = useState<File | undefined>();

  const [gallery, setGallery] = useState<(File | string)[]>([]);
  const [oldGallery, setOldGallery] = useState<(File | string)[]>([]);

  const [youTubeLink, setYouTubeLink] = useState<string>('');

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      displayName: '',
      website: '',
      description: '',
      shortDescription: '',
      youTubeLink: '',
      type: '',
      tags: [],
      launchExternal: false,
      donationAddress: '',
      promptDonation: false,
      linkRepository: false,
      systemRequirements: {
        cpu: '',
        gpu: '',
        memory: '',
        disk: '',
      },
      wineSupport: {
        mac: false,
        linux: false,
      },
      networks: [],
    },
  });

  // wait for metadata to load
  useEffect(() => {
    if (meta) {
      const _youTubeLink = meta.gallery?.find((item: GalleryMeta) => item.type === 'youtube');
      const galleryLinks = meta.gallery?.filter((item: GalleryMeta) => item.type === 'image');

      form.setFieldValue('displayName', meta.name ?? '');
      form.setFieldValue('website', meta.external_url ?? '');
      form.setFieldValue('description', meta.description ?? '');
      form.setFieldValue('shortDescription', meta.short_description ?? '');
      form.setFieldValue('youTubeLink', _youTubeLink?.src ?? '');
      form.setFieldValue('tags', meta.tags ?? []);
      form.setFieldValue('type', meta.type ?? '');
      form.setFieldValue('launchExternal', meta.launch_external ?? false);
      form.setFieldValue('promptDonation', meta.prompt_donation ?? false);
      form.setFieldValue('donationAddress', meta.donation_address || '');
      if (meta.systemRequirements) form.setFieldValue('systemRequirements', meta.systemRequirements);
      if (meta.wineSupport) form.setFieldValue('wineSupport', meta.wineSupport);
      if (meta.networks) form.setFieldValue('networks', meta.networks);

      const _gallery = galleryLinks?.map((item: GalleryMeta) => item.src) || [];
      setGallery(_gallery);
      setOldGallery(_gallery);
      meta.main_capsule && setMainCapsule(meta.main_capsule);
      meta.image && setImage(meta.image);
      _youTubeLink && setYouTubeLink(_youTubeLink.src);

      setOldMeta(meta);
      setLoading(false);
    }
  }, [meta]);

  useEffect(() => {
    const ytChange = form.values.youTubeLink !== youTubeLink;
    const galleryChange = gallery.toString() !== oldGallery.toString();
    const imgChange = !newImage && !newMainCapsule && !galleryChange && !ytChange;

    const prevMeta = JSON.stringify(oldMeta)?.split('').sort().join('');
    const curMeta = JSON.stringify({
      image: oldMeta?.image,
      main_capsule: oldMeta?.main_capsule,
      name: form.values.displayName,
      short_description: form.values.shortDescription,
      description: form.values.description,
      external_url: form.values.website,
      type: form.values.type,
      tags: form.values.tags,
      gallery: oldMeta?.gallery,
      repository: oldMeta?.repository,
      launch_external: form.values.launchExternal,
      donation_address: form.values.donationAddress,
      prompt_donation: form.values.promptDonation,
    }).split('').sort().join('');

    setSubmitDisabled(imgChange && (prevMeta === curMeta));
  }, [form.values, oldMeta, newImage, newMainCapsule, youTubeLink, gallery, oldGallery]);

  const removeMember = (member: string) => {
    setLoading(true);
    removeProjectMember(
      address,
      projectId,
      member,
      valist,
      cache,
      chainId,
    ).finally(() => {
      setLoading(false);
    });
  };

  const addMember = (member: string) => {
    setLoading(true);
    addProjectMember(
      address,
      projectId,
      member,
      valist,
      cache,
      chainId,
    ).finally(() => {
      setLoading(false);
    });
  };

  const update = (values: FormValues) => {
    setLoading(true);
    updateProject(
      address,
      projectId,
      oldMeta,
      youTubeLink,
      newImage,
      newMainCapsule,
      gallery,
      values,
      valist,
      cache,
      chainId,
    ).then((value: ProjectMeta | undefined) => {
      if (value) {
        setOldMeta(value);
        setOldGallery(gallery);
        setNewImage(undefined);
        setNewMainCapsule(undefined);
        setYouTubeLink(form.values.youTubeLink);
        setMainCapsule(value.main_capsule || '');
        setImage(value.image || '');
      };
    }).finally(() => {
      setLoading(false);  
    });
  };

  if (!gqLoading && !data?.project) {
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
    <Layout>
      <Tabs
        defaultValue="basic"
        value={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.List grow>
          <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
          <Tabs.Tab value="requirements">System Requirements</Tabs.Tab>
          <Tabs.Tab value="media">Media & Descriptions</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
          <Tabs.Tab value="releases">Releases</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic">
          <form onSubmit={form.onSubmit(update)}>
            <Stack style={{ maxWidth: 784 }}>
              <Title mt="lg">Basic Info</Title>
              <Text color="dimmed">This is your public account info.</Text>
              <Group spacing={40} grow mb={20}>
                <div style={{ width: 384, height: 512 }}>
                  <ImageInput 
                    width={384}
                    height={512}
                    onChange={setNewImage} 
                    value={newImage || image}
                    disabled={loading}
                    openRef={openRef}
                  />
                </div>
                <Stack align="flex-start">
                  <Title order={2}>Project Image <span style={{ color: "#F04438" }}>*</span></Title>
                  <Text>
                    Click below to upload or drag and drop. 
                    Formats available are PNG, JPG, GIF
                    <br/>(3:4 ratio or 768x1024px)
                  </Text>
                  <Button onClick={() => openRef?.current?.()}>
                    Change Image
                  </Button>
                </Stack>
              </Group>
              <Title order={2}>Project Details</Title>
              <TextInput 
                label="Project Name (cannot be changed)"
                disabled={true}
                value={projectName}
                required
              />
              <TextInput 
                label="Display Name"
                disabled={loading}
                required 
                {...form.getInputProps('displayName')}
              />
              <TextInput 
                label="Website"
                disabled={loading}
                {...form.getInputProps('website')}
              />
              <Checkbox
                label="Launch from external website"
                color="indigo"
                size="sm"
                {...form.getInputProps('launchExternal', { type: 'checkbox' })}
              />
              <Select
                label="Type"
                data={defaultTypes}
                placeholder="Select type"
                {...form.getInputProps('type')}
              />
              <MultiSelect
                label="Genres"
                data={defaultTags}
                placeholder="Select genres"
                searchable
                creatable
                getCreateLabel={(query) => `+ Create ${query}`}
                {...form.getInputProps('tags')}
              />

              <Checkbox
                label="Prompt for donation on download"
                color="indigo"
                size="sm"
                {...form.getInputProps('promptDonation', { type: 'checkbox' })}
              />

              {data?.prompt_donation || form.values.promptDonation &&
                <AddressInput
                  label="Donation Address"
                  required
                  value={form.values.donationAddress} 
                  onSubmit={(address: string) => form.setFieldValue('donationAddress', address)} 
                />
              }
              <NetworkInput
                form={form}
                loading={loading}
              />
            </Stack>
            <Group mt="lg">
              <Button 
                type="submit"
                disabled={submitDisabled || loading}
              >
                Save
              </Button>
            </Group>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="requirements">
          <form onSubmit={form.onSubmit(update)}>
            <Title mt="lg">System Requirements</Title>
            <Text color="dimmed">The minimum system requirements for your project.</Text>
            <Stack style={{ maxWidth: 784 }}>
              <TextInput
                label="CPU"
                disabled={loading}
                {...form.getInputProps('systemRequirements.cpu')}
              />
              <TextInput 
                label="GPU"
                disabled={loading}
                {...form.getInputProps('systemRequirements.gpu')}
              />
              <TextInput 
                label="Memory (RAM)"
                disabled={loading}
                {...form.getInputProps('systemRequirements.memory')}
              />
              <TextInput 
                label="Disk"
                disabled={loading}
                {...form.getInputProps('systemRequirements.disk')}
              />
              <Text>Compatibility Library Support (WINE/Proton)</Text>
              <Flex mb="lg" gap="lg">
                <Checkbox 
                  label="Linux Compatibility"
                  {...form.getInputProps('wineSupport.linux', { type: 'checkbox' })}
                />
                <Checkbox 
                  label="MacOS Compatibility"
                  {...form.getInputProps('wineSupport.mac', { type: 'checkbox' })}
                />
              </Flex>
            </Stack>
            <Group mt="lg">
              <Button 
                type="submit"
                disabled={submitDisabled || loading}
              >
                Save
              </Button>
            </Group>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="media">
          <form onSubmit={form.onSubmit(update)}>
            <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Media</Title>
              <Text color="dimmed">Show off your project with videos and images.</Text>
              <Title order={2}>YouTube Link</Title>
              <Text color="dimmed">Paste a link to your video.</Text>
              <TextInput
                label="YouTube Link"
                disabled={loading}
                {...form.getInputProps('youTubeLink')}
              />
              {form.values.youTubeLink && 
                <iframe
                  width="100%"
                  style={{ minHeight: 353, maxWidth: 616 }}
                  src={getYouTubeEmbedURL(form.values.youTubeLink)}
                  title="YouTube video player"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              }
              <Title order={2}>Header Image <span style={{ color: "#F04438" }}>*</span></Title>
              <Text color="dimmed">This can be the cover image of your project. Recommended size is 1824x816px.</Text>
              <div style={{ width: 912, height: 408 }}>
                <ImageInput 
                  width={912}
                  height={408}
                  onChange={setNewMainCapsule} 
                  value={newMainCapsule || mainCapsule}
                  disabled={loading}
                />
              </div>
              <Title order={2}>Gallery Images <span style={{ color: "#F04438" }}>*</span></Title>
              <Text color="dimmed">Additional images of your project. Recommended size is 16:9 ratio or 1920x1080px.</Text>
              <GalleryInput
                onChange={setGallery}
                value={gallery as any}
                disabled={loading}
              />

              <Title mt="lg">Descriptions <span style={{ color: "#F04438" }}>*</span></Title>
              <Text color="dimmed">Let everyone know about your project.</Text>
              <Title order={2}>Short Description</Title>
              <Text color="dimmed">Enter a brief summary of the project. This will be displayed on the project card or thumbnail.</Text>
              <TextInput
                label="Short Description"
                disabled={loading}
                {...form.getInputProps('shortDescription')}
              />
              <Title order={2}>Description</Title>
              <Text color="dimmed">Give an extensive overview of your project. This will be displayed on your project landing page.</Text>
              <Textarea
                label="Description"
                disabled={loading}
                autosize={true}
                minRows={4}
                maxRows={12}
                {...form.getInputProps('description')}
              />
            </Stack>
            <Group mt="lg">
              <Button
                type="submit"
                disabled={submitDisabled || loading}
              >
                Save
              </Button>
            </Group>
          </form>
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Members</Title>
            <Text color="dimmed">Members can perform the following actions:</Text>
            <List>
              <List.Item>Add or remove project members</List.Item>
              <List.Item>Update project info</List.Item>
              <List.Item>Publish new releases</List.Item>
            </List>
            <Title order={2}>Account Admins</Title>
            <MemberList
              label="Account Admin"
              members={accountMembers.map((member: any) => member.id)}
            />
            <Title order={2}>Project Admins</Title>
            <AddressInput
              onSubmit={addMember}
              disabled={loading}
            />
            <MemberList
              label="Project Admin"
              members={projectMembers.map((member: any) => member.id)}
              onRemove={removeMember}
              editable={!loading}
            />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="releases">
          <Title my="lg">Releases</Title>
          <Button onClick={() => router.push(`/-/account/${accountName}/project/${projectName}/create/release`)}>Submit Release</Button>
          <br/><br/>
          <Card>
            <List>
              {releases.map((release: any, index: number) =>
               <div key={index} style={{ marginBottom: 20 }}>
                  <Group position="apart">
                    <Text>{release.name}</Text>
                    <a target="_blank" href={release.metaURI} rel="noreferrer">view metadata</a>
                  </Group>
                </div>,
              )}
            </List>
          </Card>
        </Tabs.Panel>
        <Tabs.Panel value="activity">
          <Title my="lg">Activity</Title>
          <Card>
            <List>
              {logs.map((log: any, index: number) =>
                <div key={index} style={{ marginBottom: 20 }}>
                  <Activity  {...log} />
                </div>,
              )}
            </List>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Layout>
  );
};

export default Project;