import {
  Loader,
  TextInput,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';

export interface AddressInputProps {
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  valid?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function AddressInput(props: AddressInputProps) {
  const status = props.loading
    ? <Loader color="#5850EC" size="xs" />
    : props.valid
    ? <Icon.Check color="#669F2A" />
    : undefined;

  return (
    <TextInput
      label="Add member"
      placeholder="Address or ENS"
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
      error={props.error}
      rightSection={status}
    />
  );
}