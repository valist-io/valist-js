import type { NextPage } from 'next';
import React, { useState, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import { useListState } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import { ValistContext } from '@/components/ValistProvider';
import { AccountContext } from '@/components/AccountProvider';
import { AddressInput } from '@/components/AddressInput';
import { defaultTags, defaultTypes } from '@/forms/common';
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

interface CreateProjectProps {
  afterCreate?: () => void;
}

const CreateProject = (props: CreateProjectProps):JSX.Element => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();

  const valist = useContext(ValistContext);
  const { account } = useContext(AccountContext);

  const { data } = useQuery(query, {
    variables: { id: account?.id ?? '' },
  });

  const accountName = `${router.query.account}`;
  const accountMembers = data?.account?.members ?? [];

  // form values
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string>();
  const [mainCapsule, setMainCapsule] = useState<File | string>();
  const [gallery, setGallery] = useState<(File | string)[]>([]);
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
      account?.id,
      image,
      mainCapsule,
      gallery,
      members,
      values,
      valist,
      cache,
    ).then(success => {
      if (success) {
        if (props.afterCreate) props.afterCreate();
        router.push('/');  
      }
    }).finally(() => {
      setLoading(false);  
    });
  };

  return (
    <div>
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
            <Title mt="lg">Basic Info</Title>
            <Text color="dimmed">This is your public account info.</Text>
            <Title order={2}>Project Image</Title>
            <ImageInput 
              width={300}
              height={300}
              onChange={setImage} 
              value={image}
              disabled={loading}
            />
            <Title order={2}>Project Details</Title>
            <TextInput 
              label="Project Name (cannot be changed)"
              disabled={loading}
              required
              {...form.getInputProps('projectName')}
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
            <Select
              label="Type"
              data={defaultTypes}
              placeholder="Select type"
              nothingFound="Nothing found"
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
              onClick={() => form.onSubmit(submit)}
              disabled={loading}
            >
              Create
            </Button>
          </Group>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default CreateProject;