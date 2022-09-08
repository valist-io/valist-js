import {
  Avatar,
  Stack,
  Text,
  Title,
  Group,
} from '@mantine/core';

import useStyles from './ItemHeader.styles';

export interface ItemHeaderProps {
  name: string;
  image?: string;
  label?: string;
}

export function ItemHeader(props: ItemHeaderProps) {
  const { classes } = useStyles();
  return (
    <Group align="flex-start">
      <Avatar 
        radius="md"
        size={100} 
        src={props.image} 
      />
      <Stack spacing={0}>
        <Title order={3} className={classes.name}>
          {props.name}
        </Title>
        <Text className={classes.label}>
          {props.label}
        </Text>
      </Stack>
    </Group>
  );
}