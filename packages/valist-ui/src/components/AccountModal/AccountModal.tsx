import {
  Modal,
  Stack,
  UnstyledButton,
} from '@mantine/core';

import React from 'react';

export interface AccountModalProps {
  accounts: string[];
  onChange: (account: string) => void;
  opened?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function AccountModal(props: AccountModalProps) {
  return (
    <Modal
      title="Change Account"
      opened={props.opened}
      onClose={props.onClose}
      centered
    >
      <Stack>
        {props.accounts.map(acc => 
          <UnstyledButton 
            key={acc} 
            onClick={() => props.onChange(acc)}
          >
            {acc}
          </UnstyledButton>
        )}
        {props.children}
      </Stack>
    </Modal>
  );
}