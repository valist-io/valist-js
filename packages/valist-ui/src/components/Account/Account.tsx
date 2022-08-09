import {
  Avatar,
  Stack,
  Text,
  Title,
  Group,
} from '@mantine/core';

import useStyles from './Account.styles';

export interface AccountProps {
  name: string;
  image?: string;
  label?: string;
  large?: boolean;
}

export function Account(props: AccountProps) {
  const { classes } = useStyles({ large: props.large });
	return (
    <Group>
      <Avatar 
        radius="xl"
        size={props.large ? 56 : 40} 
        src={props.image} 
      />
      <Stack spacing={0}>
        <Title 
          order={props.large ? 2 : 5}
          className={classes.name}
        >
          {props.name}
        </Title>
        <Text 
          size={props.large ? 'md' : 'xs'}
          className={classes.label}
        >
          {props.label}
        </Text>
      </Stack>
    </Group>
  );
}