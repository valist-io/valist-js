import {
  ActionIcon,
  Group,
  Stack,
  Avatar,
  Text,
  useMantineTheme,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import { Address } from '../Address';
import { Identicon } from '../Identicon';
import { Divider } from '../Divider';

export interface MemberListProps {
  label: string;
  members: string[];
  onRemove?: (member: string) => void;
  editable?: boolean;
}

export function MemberList(props: MemberListProps) {
  const theme = useMantineTheme();
  const color = theme.colorScheme === 'dark'
    ? theme.colors.gray[2]
    : theme.colors.gray[3];

  const remove = (member: string) => {
    if (props.onRemove) props.onRemove(member);
  };

  return (
    <Stack>
      {props.members.map((mem: string, idx: number) => 
        <div key={idx}>
          <Group mb="md" noWrap>
            <Identicon value={mem} />
            <Stack spacing={0} style={{ flexGrow: 1 }}>
              <Address address={mem} />
              <Text color={color}>{props.label}</Text>
            </Stack>
            { props.editable &&
              <ActionIcon onClick={() => remove(mem)}>
                <Icon.Trash color={color} />
              </ActionIcon>  
            }
          </Group>
          { idx !== (props.members.length-1) && 
            <Divider /> 
          }
        </div>
      )}
    </Stack>
  );
}