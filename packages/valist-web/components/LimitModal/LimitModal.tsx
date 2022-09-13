import { useState, useEffect } from 'react';
import { Modal, Stack, Text, NumberInput } from '@mantine/core';
import { Button } from '@valist/ui';

export interface LimitModalProps {
  value: number;
  opened: boolean;
  onClose: () => void;
  loading?: boolean;
  onSubmit: (limit: number) => void;
}

export function LimitModal(props: LimitModalProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit(value);
  };

  return (
    <Modal
      opened={props.opened}
      onClose={props.onClose}
      title="Edit Limit"
      padding={40}
      size={580}
      centered
    >
      <form onSubmit={submit}>
        <Stack>
          <Text size="sm" color="gray.3">
            Limit the maximum amount of licenses. Set to 0 for unlimited.
          </Text>
          <NumberInput
            label="Max License Limit"
            min={0}
            disabled={props.loading}
            hideControls
            value={value}
            onChange={val => setValue(val ?? 0)}
          />
          <Button 
            style={{ marginTop: 16, alignSelf: 'flex-start' }}
            disabled={props.loading}
            type="submit"
          >
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}