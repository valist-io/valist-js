import { 
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';

import React from 'react';
import useStyles, { ButtonVariant } from './Button.styles';

export interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  label?: string;
  variant: ButtonVariant;
}

export function Button(props: ButtonProps) {
  const { variant } = props;
  const { classes } = useStyles({ variant });
  return (
    <Group position="right" noWrap>
      <Text>{props.label}</Text>
      <UnstyledButton 
        className={classes.button}
        onClick={props.onClick}
      >
        {props.children}
      </UnstyledButton>
    </Group>
  );
}

Button.defaultProps = {
  variant: 'secondary',
};