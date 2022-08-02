import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { useListState } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import { ValistContext } from '@/components/ValistProvider';
import { AccountContext } from '@/components/AccountProvider';
import { AddressInput } from '@/components/AddressInput';

import { 
  schema,
  FormValues,
  createAccount, 
} from '@/forms/create-account';

import {
  Tabs,
  Title,
  Text,
  Stack,
  Group,
  List,
  TextInput,
} from '@mantine/core';

import { 
  Button,
  ImageInput,
  MemberList,
} from '@valist/ui';

interface CreateAccountProps {
  afterCreate?: () => void;
}

const CreateAccount = (props: CreateAccountProps): JSX.Element => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();

  const valist = useContext(ValistContext);
  const { setAccount } = useContext(AccountContext);

  // form values
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | string>();
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

  // update the members list when current address changes
  useEffect(() => {
    membersHandlers.setState(address ? [address] : []);
  }, [address]);

  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      accountName: '',
      displayName: '',
      website: '',
      description: '',
    },
  });

  const submit = (values: FormValues) => {
    setLoading(true);
    createAccount(
      address,
      image,
      members,
      values,
      valist,
      cache,
    ).then((success) => {
      if (success) {
        setAccount(values.accountName);
        if (props.afterCreate) props.afterCreate();
      }
    }).finally(() => {
      setLoading(false);  
    });
  };

  return (
    <Tabs
      defaultValue="basic"
      value={activeTab}
      onTabChange={setActiveTab}
    >
      <Tabs.List grow>
        <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
        <Tabs.Tab value="members">Members</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="basic">
        <Stack style={{ maxWidth: 784 }}>
          <Title mt="lg">Basic Info</Title>
          <Text color="dimmed">This is your public account info.</Text>
          <Title order={2}>Account Image</Title>
          <ImageInput 
            width={300}
            height={300}
            onChange={setImage} 
            value={image}
            disabled={loading}
          />
          <Title order={2}>Account Details</Title>
          <TextInput 
            label="Account Name (cannot be changed)"
            disabled={loading}
            required
            {...form.getInputProps('accountName')}
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
          <TextInput
            label="Description"
            disabled={loading}
            {...form.getInputProps('description')}
          />
        </Stack>
        <Group mt="lg">
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
            <List.Item>Update account info</List.Item>
            <List.Item>Add or remove account members</List.Item>
            <List.Item>Create new projects</List.Item>
            <List.Item>Add or remove project members</List.Item>
            <List.Item>Update project info</List.Item>
            <List.Item>Publish new releases</List.Item>
          </List>
          <Title order={2}>Account Admins</Title>
          <AddressInput
            onSubmit={addMember}
            disabled={loading}
          />
          <MemberList
            label="Account Admin"
            members={members}
            onRemove={removeMember}
            editable={!loading}
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
            onClick={() => form.onSubmit(submit)}
            disabled={loading}
          >
            Create
          </Button>
        </Group>
      </Tabs.Panel>
    </Tabs>
  );
};

export default CreateAccount;