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

export interface ImportModalProps {
  opened: boolean;
  onClose: () => void;
  onImport: (mnemonic: string) => void;
}

export function ImportModal(props: ImportModalProps) {
  const [mnemonic, setMnemonic] = useState('');

  // clear mnemonic when opened or closed
  useEffect(() => {
    setMnemonic('');
  }, [props.opened]);

  const onImport = () => {
    props.onClose();
    props.onImport(mnemonic);
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
      <Title order={4}>Import Account</Title>
      <Text size={12}>
        You can import any of your wallet to Sapphire all you need to do is provide your key phrase. (Note: We would not have access to this)
      </Text>
      <Textarea
        label={'Mnemonic or Private Key'}
        my={16}
        minRows={4}
        value={mnemonic}
        onChange={(e) => setMnemonic(e.currentTarget.value)}
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
          onClick={onImport}
        >
          Import
        </Button>
      </Group>
    </Modal>
  );
}