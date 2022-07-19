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
  withCard?: boolean;
}

export function Tabs(props: TabsProps) {
  const { children, withCard, ...rest } = props;
  const { classes } = useStyles({ withCard });

  return (
    <MantineTabs 
      variant="unstyled" 
      classNames={classes}
      tabPadding={16}
      {...rest}
    >
      {children}
    </MantineTabs>
  );
}

Tabs.Tab = MantineTabs.Tab;
