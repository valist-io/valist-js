import { Footer as MantineFooter } from '@mantine/core';
import React from 'react';
import useStyles from './Footer.styles';

export interface FooterProps {
  children?: React.ReactNode;
}

export function Footer(props: FooterProps) {
  const { classes } = useStyles();
  return (
    <MantineFooter height={60} className={classes.root} fixed>
      {props.children}
    </MantineFooter>
  );
}