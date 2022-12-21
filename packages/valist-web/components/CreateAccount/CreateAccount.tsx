import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { useListState } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import { AddressInput } from '@/components/AddressInput';
import { NameInput } from '@/components/NameInput';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';

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

export interface CreateAccountProps {
  onboard?: boolean;
  setAccount?: (value: string) => void;
}

export function CreateAccount(props: CreateAccountProps) {
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();
  const valist = useValist();
  const router = useRouter();

  // form values
  const openRef = useRef<() => void>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>();
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
      chainId,
    ).then((success) => {
      if (success && !props.onboard) router.push('/');
      if (success && props.setAccount) props.setAccount(form.values.accountName);
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
          <Tabs.Tab value="basic">Account Info</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="basic">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Set up your Account</Title>
            <Text color="dimmed">Tell us a bit about your account.</Text>
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
                <Title order={2}>Account Image</Title>
                <Text>
                  Click below to upload or drag and drop. 
                  Formats available are SVG, PNG, JPG (max. 800x800px)
                </Text>
                <Button mt={24} onClick={openRef.current}>
                  Change Image
                </Button>
              </Stack>
            </Group>
            <Title order={2}>Account Details</Title>
            <NameInput 
              label="Account Name (cannot be changed)"
              disabled={loading}
              parentId={chainId}
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
              disabled={!(form.values.accountName && form.values.displayName)}
            >
              Proceed to Add Members
            </Button>
          </Group>
        </Tabs.Panel>
        <Tabs.Panel value="members">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Add Members</Title>
            <Text color="dimmed">Members can perform the following actions:</Text>
            <List>
              <List.Item>Update account info</List.Item>
              <List.Item>Add or remove account members</List.Item>
              <List.Item>Create new projects</List.Item>
              <List.Item>Add or remove project members</List.Item>
              <List.Item>Update project info</List.Item>
              <List.Item>Publish new releases</List.Item>
            </List>
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
              type="submit"
              disabled={loading}
            >
              Complete Create Account
            </Button>
          </Group>
        </Tabs.Panel>
      </Tabs>
    </form>
  );
};
