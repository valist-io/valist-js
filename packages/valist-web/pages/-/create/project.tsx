import type { NextPage } from 'next';
import React, { useState, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery, gql } from '@apollo/client';
import { useListState } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { AccountContext } from '@/components/AccountProvider';
import { AddressInput } from '@/components/AddressInput';
import { createProject, schema, FormValues } from '@/forms/create-project';

import {
  Group,
  Text,
  Title,
  Stack,
  List,
} from '@mantine/core';

import { 
  Tabs,
  Button,
  ImageInput,
  TextInput,
  Textarea,
  MemberList,
  GalleryInput,
} from '@valist/ui';

export const query = gql`
  query AccountMembers($id: String!){
    account(id: $id) {
      members {
        id
      }
    }
  }
`;

const Project: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();

  const valist = useContext(ValistContext);
  const { account } = useContext(AccountContext);

  const { data } = useQuery(query, {
    variables: { id: account?.id },
  });

  const accountMembers = data?.account?.members ?? [];

  // form values
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>(null);
  const [mainCapsule, setMainCapsule] = useState<File>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [members, membersHandlers] = useListState<string>([]);

  // form controls
  const [active, setActive] = useState(0);
  const nextStep = () => setActive(active < 3 ? active + 1 : active);
  const prevStep = () => setActive(active > 0 ? active - 1 : active);

  const removeMember = (member: string) => {
    membersHandlers.filter((other: string) => 
      other.toLowerCase() !== member.toLowerCase()
    );
  };

  const addMember = (member: string) => {
    removeMember(member);
    membersHandlers.append(member);
  };

  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      projectName: '',
      displayName: '',
      website: '',
      description: '',
      shortDescription: '',
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
      cache
    ).then(project => {
      if (project) {
        router.push('/');  
      }
      
      setLoading(false);  
    });
  };

  return (
    <Layout>
      <Tabs active={active} onTabChange={setActive} grow>
        <Tabs.Tab label="Basic Info">
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
          </Stack>
        </Tabs.Tab>
        <Tabs.Tab label="Descriptions">
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
        </Tabs.Tab>
        <Tabs.Tab label="Members">
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
              members={accountMembers.map(acc => acc.id)}
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
        </Tabs.Tab>
        <Tabs.Tab label="Media">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Media</Title>
            <Text color="dimmed">Show off your project with videos and images.</Text>
            <Title order={2}>YouTube Link</Title>
            <Text color="dimmed">Paste a link to your video.</Text>
            <TextInput
              label="YouTube Link"
              disabled={loading}
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
        </Tabs.Tab>
      </Tabs>
      <Group mt="lg">
        { active > 0 && 
          <Button onClick={() => prevStep()} variant="secondary">Back</Button>
        }
        { active < 3 &&
          <Button onClick={() => nextStep()} variant="primary">Continue</Button>
        }
        { active === 3 &&
          <Button onClick={form.onSubmit(submit)} disabled={loading}>Create</Button>
        }
      </Group>
    </Layout>
  );
};

export default Project;