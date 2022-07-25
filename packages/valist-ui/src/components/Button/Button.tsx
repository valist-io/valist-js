import { 
  Button as MantineButton, 
  Loader,
  useMantineTheme,
} from '@mantine/core';

import React from 'react';
import useStyles, { ButtonVariant } from './Button.styles';

export interface ButtonProps {
  children?: React.ReactNode;
  variant: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  leftIcon?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps) {
  const theme = useMantineTheme();
  const { classes } = useStyles({ variant: props.variant });
  const { children, loading, variant, ...rest } = props;

  const loader = () => {
    if (variant === 'primary') {
      return <Loader color={theme.white} size="sm" />;
    } else if (variant === 'secondary') {
      return <Loader color={theme.colors.purple[3]} size="sm" />;
    } else if (variant === 'subtle') {
      return <Loader color={theme.colors.purple[3]} size="sm" />;
    } else {
      return <React.Fragment>Loading...</React.Fragment>;
    }
  };

  return (
    <MantineButton {...rest} classNames={classes}>
      { props.loading ? loader() : props.children }
    </MantineButton>
  );
}

Button.defaultProps = {
  variant: 'primary',
}