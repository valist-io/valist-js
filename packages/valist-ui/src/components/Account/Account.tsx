import {
  Avatar,
  Stack,
  Text,
  Group,
} from '@mantine/core';

import useStyles from './Account.styles';

export interface AccountProps {
  name: string;
  image?: string;
  label?: string;
}

export function Account(props: AccountProps) {
  const { classes } = useStyles();
	return (
    <Group>
      <Avatar size={40} radius="xl" src={props.image} />
      <Stack spacing={0}>
        <Text className={classes.name}>
          {props.name}
        </Text>
        <Text className={classes.label}>
          {props.label}
        </Text>
      </Stack>
    </Group>
  );
}