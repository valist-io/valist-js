import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { useAccount } from 'wagmi';
import { useApolloClient, InMemoryCache } from '@apollo/client';
import { showNotification, hideNotification } from '@mantine/notifications';
import { ValistContext } from '@/components/ValistProvider';
import { AccountContext } from '@/components/AccountProvider';
import { createAccount } from './form';

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
  AddressInput,
  MemberList,
} from '@valist/ui';

const ACCOUNT_LOADING_ID = 'account-create-loading';
const ACCOUNT_ERROR_ID = 'account-create-error';

export function CreateAccountForm() {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();

  const valist = useContext(ValistContext);
  const { setAccount } = useContext(AccountContext);

  // form values
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | undefined>();
  const [members, membersHandlers] = useListState<string>([]);

  // form controls
  const openRef = useRef(null);
  const [active, setActive] = useState(0);
  const nextStep = () => setActive(active < 1 ? active + 1 : active);
  const prevStep = () => setActive(active > 0 ? active - 1 : active);

  // update the members list when current address changes
  useEffect(() => {
    membersHandlers.setState(address ? [address] : []);
  }, [address]);

  const form = useForm({
    initialValues: {
      accountName: '',
      displayName: '',
      website: '',
      description: '',
    },
  });

  const submit = () => {
    setLoading(true);
    hideNotification(ACCOUNT_ERROR_ID);
    showNotification({
      id: ACCOUNT_LOADING_ID,
      autoClose: false,
      disallowClose: true,
      loading: true,
      title: 'Loading',
      message: 'Waiting for transaction',
    });

    createAccount(
      address,
      form.values.accountName,
      form.values.displayName,
      form.values.description,
      form.values.website,
      image,
      members,
      valist,
      cache as InMemoryCache,
    ).then(() => {
      setAccount(form.values.accountName);
      router.push('/');
    }).catch((err) => {
      showNotification({
        id: ACCOUNT_ERROR_ID,
        autoClose: false,
        color: 'red',
        title: 'Error',
        message: err.message,
      });
    }).finally(() => {
      hideNotification(ACCOUNT_LOADING_ID);
      setLoading(false);
    });
  };

  return (
    <React.Fragment>
      <Tabs active={active} onTabChange={setActive} grow>
        <Tabs.Tab label="Basic Info">
          <Stack>
            <Title>Basic Info</Title>
            <Text color="dimmed">This is your public account info.</Text>
            <Group spacing="xl">
              <ImageInput 
                width={300}
                height={300}
                onChange={setImage} 
                value={image}
                openRef={openRef}
                disabled={loading}
              />
              <Stack align="start">
                <Title>
                  Set Image
                </Title>
                <Text color="dimmed" style={{ maxWidth: 400 }}>
                  Click below to upload or drag and drop. Formats available are SVG, PNG, JPG (max. 800x800px)
                </Text>
                <Button onClick={openRef.current ?? undefined} disabled={loading}>
                  Change Image
                </Button>
              </Stack>
            </Group>
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
          <Stack>
            <Title>Members</Title>
            <Text color="dimmed">Account members can perform the following actions:</Text>
            <List>
              <List.Item>Update account settings</List.Item>
              <List.Item>Add / remove account members</List.Item>
              <List.Item>Create new projects</List.Item>
              <List.Item>Add / remove project members</List.Item>
              <List.Item>Update project settings</List.Item>
              <List.Item>Publish new releases</List.Item>
            </List>
            <AddressInput
              onEnter={(member) => console.log('add', member)}
              members={members}
              disabled={loading}
            />
            <MemberList 
              members={members}
              onRemove={(member) => console.log('remove', member)}
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
          <Button onClick={() => submit()} disabled={loading}>Save</Button>
        }
      </Group>
    </React.Fragment>
  );
}