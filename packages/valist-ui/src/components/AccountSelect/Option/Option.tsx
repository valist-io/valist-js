import {
  Group,
  UnstyledButton,
} from '@mantine/core';

import { useContext } from 'react';
import * as Icon from 'tabler-icons-react';
import { Account } from '../../Account';
import { AccountSelectContext } from '../AccountSelect';

export interface OptionProps {
  name: string;
  image?: string;
  label?: string;
}

export function Option(props: OptionProps) {
  const { value, setValue } = useContext(AccountSelectContext);

  return (
    <UnstyledButton onClick={() => setValue(props.name)}>
      <Group position="apart">
        <Account {...props} />
        {value === props.name && 
          <Icon.Check color="#669F2A" /> 
        }
      </Group>
    </UnstyledButton>
  );
}