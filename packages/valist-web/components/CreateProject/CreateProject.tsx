import React, { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import { useListState } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import { AddressInput } from '@/components/AddressInput';
import { NameInput } from '@/components/NameInput';
import { defaultTags, defaultTypes } from '@/forms/common';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
import query from '@/graphql/CreateProjectPage.graphql';

import { 
  schema,
  FormValues,
  createProject, 
} from '@/forms/create-project';

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
} from '@mantine/core';

import { 
  Button,
  ImageInput,
  MemberList,
  GalleryInput,
} from '@valist/ui';

export interface CreateProjectProps {
  onboard?: boolean;
  account?: string;
}

export function CreateProject(props: CreateProjectProps) {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();
  const valist = useValist();

  const accountName = props.account || `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const { data } = useQuery(query, {
    variables: { id: accountId },
  });
  
  const accountMembers = data?.account?.members ?? [];
  console.log('accountName', accountName);

  // form values
  const openRef = useRef<() => void>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>();
  const [mainCapsule, setMainCapsule] = useState<File>();
  const [gallery, setGallery] = useState<File[]>([]);
  const [members, membersHandlers] = useListState<string>([]);
  const [activeTab, setActiveTab] = useState<string | null>();

  const removeMember = (member: string) => {
    membersHandlers.filter((other: string) => 
      other.toLowerCase() !== member.toLowerCase(),
    );
  };

  const addMember = (member: string) => {
    removeMember(member);
    membersHandlers.append(member);
  };

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      projectName: '',
      displayName: '',
      website: '',
      description: '',
      shortDescription: '',
      youTubeLink: '',
      tags: [],
      type: '',
    },
  });

  const submit = (values: FormValues) => {
    setLoading(true);
    createProject(
      address,
      accountId,
      image,
      mainCapsule,
      gallery,
      members,
      values,
      valist,
      cache,
      chainId,
    ).then(success => {
      if (success) router.push('/-/dashboard');
    }).finally(() => {
      setLoading(false);  
    });
  };

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Tabs 
        defaultValue="basic"
        value={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.List grow>
          <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
          <Tabs.Tab value="descriptions">Descriptions</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
          <Tabs.Tab value="media">Media</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Create Project</Title>
            <Text color="dimmed">
              Ready to distribute your software in a decentralized way?
              Let us help you get started.
            </Text>
            <Group spacing={40} grow>
              <ImageInput 
                width={300}
                height={300}
                onChange={setImage} 
                value={image}
                disabled={loading}
                openRef={openRef}
              />
              <Stack align="flex-start">
                <Title order={2}>Project Image</Title>
                <Text>
                  Click below to upload or drag and drop. 
                  Formats available are SVG, PNG, JPG (max. 800x800px)
                </Text>
                <Button onClick={() => openRef?.current?.()}>
                  Change Image
                </Button>
              </Stack>
            </Group>
            <NameInput 
              label="Display Name"
              disabled={loading}
              parentId={accountId}
              required
              onSanitize={value => form.setFieldValue('projectName', value)}
              {...form.getInputProps('displayName')}
            />
            <TextInput 
              label="Website"
              disabled={loading}
              {...form.getInputProps('website')}
            />
            <Select
              label="Type"
              data={defaultTypes}
              placeholder="Select type"
              nothingFound="Nothing found"
              required
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              {...form.getInputProps('type')}
            />
            <MultiSelect
              label="Tags"
              data={defaultTags}
              placeholder="Select tags"
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              {...form.getInputProps('tags')}
            />
          </Stack>
          <Group mt="lg">
            <Button 
              onClick={() => setActiveTab('descriptions')}
              variant="primary"
              disabled={!(form.values.projectName && form.values.displayName)}
            >
              Continue
            </Button>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="descriptions">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Descriptions</Title>
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
              onClick={() => setActiveTab('basic')}
              variant="secondary"
            >
              Back
            </Button>
            <Button 
              onClick={() => setActiveTab('members')}
              variant="primary"
            >
              Continue
            </Button>
          </Group>
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
              members={accountMembers.map((acc: any) => acc.id)}
            />
            <Title order={2}>Project Admins</Title>
            <AddressInput
              onSubmit={addMember}
              disabled={loading}
            />
            <MemberList
              label="Project Admin"
              members={members}
              onRemove={removeMember}
              editable={!loading}
            />
          </Stack>
          <Group mt="lg">
            <Button 
              onClick={() => setActiveTab('descriptions')}
              variant="secondary"
            >
              Back
            </Button>
            <Button 
              onClick={() => setActiveTab('media')}
              variant="primary"
            >
              Continue
            </Button>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="media">
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
            <Title order={2}>Header Image</Title>
            <Text color="dimmed">This can be the cover image of your game or app. Recommended size is (616x353).</Text>
            <ImageInput 
              width={616}
              height={353}
              onChange={setMainCapsule} 
              value={mainCapsule}
              disabled={loading}
            />
            <Title order={2}>Gallery Images</Title>
            <Text color="dimmed">Additional images of your game or app. Recommended size is (1280x720 or 1920x1080).</Text>
            <GalleryInput
              onChange={setGallery}
              value={gallery}
              disabled={loading}
            />
          </Stack>
          <Group mt="lg">
            <Button 
              onClick={() => setActiveTab('members')}
              variant="secondary"
            >
              Back
            </Button>
            <Button 
              type="submit"
              disabled={loading}
            >
              Create
            </Button>
          </Group>
        </Tabs.Panel>
      </Tabs>
    </form>
  );
};
