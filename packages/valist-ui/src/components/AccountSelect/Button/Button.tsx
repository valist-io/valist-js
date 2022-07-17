import { 
  Group,
  UnstyledButton,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import { Account } from '../../Account';

export interface ButtonProps {
  name: string;
  image?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps) {
  return (
    <UnstyledButton style={props.style} onClick={props.onClick}>
      <Group spacing={10}>
        <Account 
          name={props.name} 
          label="change account" 
          image={props.image} 
        />
        <Icon.CaretDown 
          style={{ alignSelf: 'flex-start', marginTop: 4 }} 
          size={16} 
          fill="currentColor" 
        />
      </Group>
    </UnstyledButton>
  );
}