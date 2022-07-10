import { 
  Avatar,
  Group,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';

export interface AccountPickerProps {
  account: string;
  onClick?: () => void;
}

export function AccountPicker(props: AccountPickerProps) {
  const theme = useMantineTheme();
  const color = theme.colorScheme === 'dark'
    ? theme.colors.gray[2]
    : theme.colors.gray[3];

  return (
    <UnstyledButton onClick={props.onClick}>
      <Group>
        <Avatar size="md" radius="xl" color="indigo" />
        <Stack spacing={0}>
          <Group>
            <Text
              size="sm"
              style={{ maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {props.account}
            </Text>
            <Icon.CaretDown size={12} fill="true" />
          </Group>
          <Text size="xs" color={theme.colors.gray[3]}>
            change account
          </Text>
        </Stack>
      </Group>
    </UnstyledButton>
  );
}