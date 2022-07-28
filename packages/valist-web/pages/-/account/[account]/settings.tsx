import type { NextPage } from 'next';
import React, { useState, useEffect, useContext } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useAccount, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import { useForm, zodResolver } from '@mantine/form';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { AddressInput } from '@/components/AddressInput';
import query from '@/graphql/UpdateAccountPage.graphql';

import { 
  schema,
  FormValues,
  updateAccount,
  addAccountMember, 
  removeAccountMember ,
} from '@/forms/update-account';

import {
  Title,
  Text,
  Stack,
  Group,
  List,
  TextInput,
} from '@mantine/core';

import { 
  Tabs,
  Button,
  ImageInput,
  MemberList,
} from '@valist/ui';

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 0, accountName);

  const { data } = useQuery(query, { variables: { accountId } });
  const { data: meta } = useSWRImmutable(data?.account?.metaURI);

  const members = data?.account?.members ?? [];

  // form values
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | string>();

  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      displayName: '',
      website: '',
      description: '',
    },
  });

  // wait for metadata to load
  useEffect(() => {
    if (meta) {
      form.setFieldValue('displayName', meta.name ?? '');
      form.setFieldValue('website', meta.external_url ?? '');
      form.setFieldValue('description', meta.description ?? '');
      setImage(meta.image);
      setLoading(false);
    }
  }, [meta]);

  const removeMember = (member: string) => {
    setLoading(true);
    removeAccountMember(
      address,
      accountId,
      member,
      valist,
      cache,
    ).finally(() => {
      setLoading(false);
    });
  };

  const addMember = (member: string) => {
    setLoading(true);
    addAccountMember(
      address,
      accountId,
      member,
      valist,
      cache,
    ).finally(() => {
      setLoading(false);
    });
  };

  const update = (values: FormValues) => {
    setLoading(true);
    updateAccount(
      address,
      accountId,
      image,
      values,
      valist,
      cache,
    ).finally(() => {
      setLoading(false);  
    });
  };

  return (
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
        { title: 'Settings', href: `/-/${accountName}/settings` },
      ]}
    >
      <Tabs grow>
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
              value={accountName}
              disabled
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
            <Button onClick={form.onSubmit(update)} disabled={loading}>Save</Button>
          </Group>
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
              members={members.map((member: any) => member.id)}
              onRemove={removeMember}
              editable={!loading}
            />
          </Stack>
        </Tabs.Tab>
      </Tabs>
    </Layout>
  );
};

export default SettingsPage;