import {
  Tabs as MantineTabs
} from '@mantine/core';

import React from 'react';
import useStyles from './Tabs.styles';

export interface TabsProps {
  active?: number;
  grow?: boolean;
  onTabChange?(tabIndex: number, tabKey?: string): void;
  children: React.ReactNode;
}

export function Tabs(props: TabsProps) {
  const { classes } = useStyles();
  const { children, ...rest } = props;

  return (
    <MantineTabs 
      variant="unstyled" 
      classNames={classes}
      {...rest}
    >
      {children}
    </MantineTabs>
  );
}

Tabs.Tab = MantineTabs.Tab;
