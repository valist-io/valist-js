import {
  Avatar,
  Group,
  Stack,
  Text,
  Modal,
  Button,
  UnstyledButton,
} from '@mantine/core';

import React, { useState } from 'react';
import { NextLink } from '@mantine/next';
import * as Icons from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCurrentAccount, setCurrentAccount } from './accountsSlice';

interface AccountPickerProps {
  accountNames: string[];
}

export default function AccountPicker(props: AccountPickerProps) {
  const dispatch = useAppDispatch();
  const [opened, setOpened] = useState(false);
  const account = useAppSelector(selectCurrentAccount);
  
  const changeAccount = (name: string) => {
    dispatch(setCurrentAccount(name));
    setOpened(false);
  };

  return (
    <React.Fragment>
      {/* Button */}
      <UnstyledButton onClick={() => setOpened(true)}>
        <Group>
          <Avatar size="md" radius="xl" color="indigo" />
          <Stack spacing={0}>
            <Group>
              <Text
                size="sm"
                style={{ maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                {account}
              </Text>
              <Icons.CaretDown size={12} fill="true" />
            </Group>
            <Text size="xs" color="dimmed">
              Change Account
            </Text>
          </Stack>
        </Group>
      </UnstyledButton>
      {/* Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Change Account"
        overflow="inside"
        centered
      >
        <Stack>
          {props.accountNames.map(name =>
            <UnstyledButton key={name} onClick={() => changeAccount(name)}>
              <Group>
                <Avatar size="md" radius="xl" color="indigo" />
                <Text>{name}</Text>
              </Group>
            </UnstyledButton>
          )}
          <Button 
            color="green" 
            variant="outline" 
            component={NextLink} 
            href="/create/account"
          >
            Create Account
          </Button>
        </Stack>
      </Modal>
    </React.Fragment>
  );
}
