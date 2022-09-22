import {
  ActionIcon,
  Group,
  useMantineTheme,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import { List } from '../List';
import { Member } from '../Member';

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
          <Member member={mem} label={props.label} />
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