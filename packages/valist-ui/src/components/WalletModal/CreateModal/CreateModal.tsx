import {
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';

import { useState, useEffect } from 'react';
import { Button } from '../../Button';

export interface CreateModalProps {
  opened: boolean;
  onClose: () => void;

  generate: () => string;
  onCreate: (mnemonic: string) => void;
}

export function CreateModal(props: CreateModalProps) {
  const [mnemonic, setMnemonic] = useState('');

  // generate new mnemonic when opened or closed
  useEffect(() => {
    setMnemonic(props.generate());
  }, [props.opened]);

  const onCreate = () => {
    props.onClose();
    props.onCreate(mnemonic);
  };

  return (
    <Modal
      radius={16}
      centered={true}
      zIndex={2147483648}
      opened={props.opened}
      onClose={props.onClose}
      withCloseButton={false}
    >
      <Title order={4}>Create Account</Title>
      <Text size={12}>Back up your recovery phrase and keep it somewhere secure.</Text>
      <Textarea
        minRows={4} 
        my={16}
        value={mnemonic}
        disabled
      />
      <Group grow>
        <Button
          variant="outline"
          onClick={props.onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={onCreate}
        >
          Create
        </Button>
      </Group>
    </Modal>
  );
}