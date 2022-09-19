import { 
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';

import React from 'react';
import { useClipboard } from '@mantine/hooks';
import * as Icon from 'tabler-icons-react';

export interface AddressProps {
  address: string;
  truncate: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export function Address(props: AddressProps) {
  const clipboard = useClipboard();

  return (
    <UnstyledButton 
      style={props.style} 
      onClick={() => clipboard.copy(props.address)}
    >
      <Group spacing={2} noWrap>
        <Text style={{ fontSize: props.size }}>
          { props.truncate
            ? `${props.address.slice(0, 6)}..${props.address.slice(-4)}`
            : props.address
          }
        </Text>
      </Group>
    </UnstyledButton>
  );
}

Address.defaultProps = {
  truncate: false,
  size: 16,
};