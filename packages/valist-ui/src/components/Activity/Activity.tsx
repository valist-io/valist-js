import {
  Anchor,
  Stack,
  Text,
  Group,
} from '@mantine/core';

import React from 'react';
import { Identicon } from '../Identicon'; 
import useStyles from './Activity.styles';

export interface ActivityProps {
  sender: string;
  href: string;
  children?: React.ReactNode;
}

export function Activity(props: ActivityProps) {
  const { classes } = useStyles();
	return (
    <Group noWrap>
      <Identicon value={props.sender} />
      <Stack spacing={4}>
        <Text className={classes.text}>
          {props.children}
        </Text>
        <Anchor 
          className={classes.link} 
          href={props.href} 
          target="_blank"
        >
          view transaction
        </Anchor>
      </Stack>
    </Group>
  );
}