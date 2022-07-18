import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';
import { useListState } from '@mantine/hooks';
import { useForm, zodResolver } from '@mantine/form';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { AccountContext } from '@/components/AccountProvider';
import { AddressInput } from '@/components/AddressInput';
import { createAccount, schema, FormValues } from '@/forms/create-account';

import {
  Title,
  Text,
  Stack,
  Group,
  List,
} from '@mantine/core';

import { 
  Tabs,
  Button,
  ImageInput,
  MemberList,
  TextInput,
} from '@valist/ui';

const Account: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();

  const valist = useContext(ValistContext);
  const { setAccount } = useContext(AccountContext);

  // form values
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>(null);
  const [members, membersHandlers] = useListState<string>([]);

  // form controls
  const [active, setActive] = useState(0);
  const nextStep = () => setActive(active < 1 ? active + 1 : active);
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

  // update the members list when current address changes
  useEffect(() => {
    membersHandlers.setState(address ? [address] : []);
  }, [address]);

  const form = useForm<FormValues>({
    schema: zodResolver(schema),
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
      cache
    ).then(account => {
      if (account) {
        setAccount(account);
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
        </Tabs.Tab>
        <Tabs.Tab label="Members">
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
        </Tabs.Tab>
      </Tabs>
      <Group mt="lg">
        { active > 0 && 
          <Button onClick={() => prevStep()} variant="secondary">Back</Button>
        }
        { active < 1 &&
          <Button onClick={() => nextStep()} variant="primary">Continue</Button>
        }
        { active === 1 &&
          <Button onClick={form.onSubmit(submit)} disabled={loading}>Create</Button>
        }
      </Group>
    </Layout>
  );
};

export default Account;