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
import { List } from '../List';

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
    <List>
      {props.members.map((mem: string, idx: number) => 
        <Group key={idx} noWrap>
          <Identicon value={mem} />
          <Stack spacing={0} style={{ flexGrow: 1 }}>
            <Address address={mem} />
            <Text color={color}>{props.label}</Text>
          </Stack>
          { props.editable && props.members.length > 1 &&
            <ActionIcon variant="transparent" onClick={() => remove(mem)}>
              <Icon.Trash color={color} />
            </ActionIcon>  
          }
        </Group>
      )}
    </List>
  );
}