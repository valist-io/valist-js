import { 
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';

import { useClipboard, useHover } from '@mantine/hooks';
import * as Icon from 'tabler-icons-react';

export interface AddressProps {
  address: string;
  truncate: boolean;
}

export function Address(props: AddressProps) {
  const { hovered, ref } = useHover();
  const clipboard = useClipboard();

  return (
    <UnstyledButton onClick={() => clipboard.copy(props.address)}>
      <Group spacing={2} ref={ref} noWrap>
        <Text>
          {props.truncate 
            ? `${props.address.slice(0, 6)}..${props.address.slice(-4)}`
            : props.address
          }
        </Text>
        { hovered && (clipboard.copied 
          ? <Icon.Check size={16} />
          : <Icon.Copy size={16} />
        )}
      </Group>
    </UnstyledButton>
  );
}

Address.defaultProps = {
  truncate: false,
};