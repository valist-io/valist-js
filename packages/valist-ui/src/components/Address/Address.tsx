import { 
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';

import React, { useContext } from 'react';
import { useClipboard } from '@mantine/hooks';
import * as Icon from 'tabler-icons-react';

export interface AddressContextType {
  resolveName: (address: string) => { data: string | undefined | null, isLoading: boolean };
}

export const AddressContext = React.createContext<AddressContextType>({
  resolveName: (address: string) => ({ data: undefined, isLoading: false }),
});

export const AddressProvider = AddressContext.Provider;

export interface AddressProps {
  address: string;
  truncate: boolean;
  size?: number;
  style?: React.CSSProperties;
}

export function Address(props: AddressProps) {
  const clipboard = useClipboard();
  const { resolveName } = useContext(AddressContext);
  const { data: name } = resolveName(props.address);

  const label = name
    ? name
    : props.truncate
    ? `${props.address.slice(0, 6)}..${props.address.slice(-4)}`
    : props.address;

  return (
    <UnstyledButton 
      style={props.style} 
      onClick={() => clipboard.copy(props.address)}
    >
      <Group spacing={2} noWrap>
        <Text style={{ fontSize: props.size }}>
          { label }
        </Text>
      </Group>
    </UnstyledButton>
  );
}

Address.defaultProps = {
  truncate: false,
  size: 16,
};