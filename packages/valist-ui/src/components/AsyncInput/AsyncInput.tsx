import {
  Loader,
  TextInput,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';

export interface AsyncInputProps {
  disabled?: boolean;
  error?: string;
  loading?: boolean;
  valid?: boolean;
  value?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function AsyncInput(props: AsyncInputProps) {
  const { loading, valid, ...rest } = props;

  const status = props.loading
    ? <Loader color="#5850EC" size="xs" />
    : props.valid
    ? <Icon.Check color="#669F2A" />
    : props.value
    ? <Icon.AlertCircle color="#F04438" />
    : undefined;

  return (
    <TextInput
      {...rest}
      rightSection={status}
    />
  );
}