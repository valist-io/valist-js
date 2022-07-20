import {
  Tabs as MantineTabs
} from '@mantine/core';

import React from 'react';
import useStyles, { TabsVariant } from './Tabs.styles';

export interface TabsProps {
  active?: number;
  grow?: boolean;
  onTabChange?(tabIndex: number, tabKey?: string): void;
  children: React.ReactNode;
  variant?: TabsVariant;
}

export function Tabs(props: TabsProps) {
  const { children, variant, ...rest } = props;
  const { classes } = useStyles({ variant });

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

Tabs.defaultProps = {
  variant: 'default',
}