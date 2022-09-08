import {
  UnstyledButton,
  Group,
  useMantineTheme,
} from '@mantine/core';

import React from 'react';
import * as Icon from 'tabler-icons-react';
import useStyles from './EditButton.styles';

export interface EditButtonProps {
  children?: React.ReactNode;
  fill?: boolean;
  onClick?: () => void;
}

export function EditButton(props: EditButtonProps) {
  const theme = useMantineTheme();
  const { classes } = useStyles({ fill: props.fill });

  return (
    <UnstyledButton className={classes.button} onClick={props.onClick}>
      <Group position="apart">
        {props.children}
        <Icon.Edit color={theme.colors.gray[3]} />
      </Group>
    </UnstyledButton>
  );
}