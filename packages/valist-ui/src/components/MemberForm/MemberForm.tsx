import {
  ActionIcon,
  Group,
  Stack,
  Avatar,
  Text,
  TextInput,
  Divider,
} from '@mantine/core';

import { useState } from 'react';
import * as Icon from 'tabler-icons-react';
import { Address } from '../Address';

export interface MemberFormProps {
  members: string[];
  onAdd: (member: string) => void;
  onRemove: (member: string) => void;
}

export function MemberForm(props: MemberFormProps) {
  const [value, setValue] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onAdd(value);
  };

  return (
    <Stack>
      <form onSubmit={onSubmit}>
        <TextInput
          size="md"
          label="Add member by address or ENS"
          value={value} 
          onChange={(event) => setValue(event.currentTarget.value)}
          rightSection={
            <ActionIcon 
              variant="filled" 
              type="submit"
              style={{ backgroundColor: '#5850EC' }}
            >
              <Icon.Plus size={18} />
            </ActionIcon>
          }
        />
      </form>
      {props.members.map((mem: string, idx: number) => 
        <div key={idx}>
          <Group noWrap>
            <Avatar size="lg" radius="xl" color="red" />
            <Stack spacing={0} style={{ flexGrow: 1 }}>
              <Address address={mem} />
              <Text color="dimmed">Admin</Text>
            </Stack>
            <ActionIcon onClick={() => props.onRemove(mem)}>
              <Icon.Trash />
            </ActionIcon>
          </Group>
          { idx !== (props.members.length-1) && <Divider mt="xs" /> }
        </div>
      )}
    </Stack>
  );
}