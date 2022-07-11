import { 
  TextInput,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import { useState } from 'react';

export interface AddressInputProps {
  onEnter: (value: string) => void;
  disabled?: boolean;
}

export function AddressInput(props: AddressInputProps) {
  const theme = useMantineTheme();
  const [value, setValue] = useState('');

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (value && !props.disabled) {
      props.onEnter(value);
    }
    
    setValue('');
  };

  return (
    <form onSubmit={submit}>
      <TextInput
        size="md"
        label="Add member"
        placeholder="Address or ENS"
        value={value} 
        onChange={(event) => setValue(event.currentTarget.value)}
        disabled={props.disabled}
        rightSection={
          <ActionIcon 
            variant="filled" 
            type="submit"
            disabled={props.disabled}
            style={{ backgroundColor: theme.colors.purple[3] }}
          >
            <Icon.Plus size={18} />
          </ActionIcon>
        }
      />
    </form>
  );
}