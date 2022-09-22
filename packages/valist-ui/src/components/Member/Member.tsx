import {
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';

import { Address } from '../Address';
import { Identicon } from '../Identicon';

export interface MemberProps {
  member: string;
  label?: string;
  truncate: boolean;
}

export function Member(props: MemberProps) {
  const theme = useMantineTheme();
  const color = theme.colorScheme === 'dark'
    ? theme.colors.gray[2]
    : theme.colors.gray[3];

  return (
    <Group noWrap>
      <Identicon value={props.member} />
      <Stack spacing={0} style={{ flexGrow: 1 }}>
        <Address address={props.member} truncate={props.truncate} />
        <Text color={color}>{props.label}</Text>
      </Stack>
    </Group>
  );
}

Member.defaultProps = {
  truncate: false,
};