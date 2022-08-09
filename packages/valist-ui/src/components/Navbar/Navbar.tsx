import {
  Navbar as MantineNavbar,
} from '@mantine/core';

import React from 'react';
import useStyles from './Navbar.styles';
import { Link } from './Link/Link';

export interface NavbarProps {
  children?: React.ReactNode;
  opened: boolean;
}

export interface NavbarComponent extends React.FC<NavbarProps> {
  Link: typeof Link;
  Section: typeof MantineNavbar.Section;
}

export const Navbar: NavbarComponent = (props: NavbarProps) => {
  const { classes } = useStyles();

  return (
    <MantineNavbar
      hiddenBreakpoint="sm" 
      hidden={!props.opened} 
      width={{ sm: 250 }}
      className={classes.root}
    >
      {props.children}
    </MantineNavbar>
  );
}

Navbar.Link = Link;
Navbar.Section = MantineNavbar.Section;

Navbar.defaultProps = {
  opened: false,
};