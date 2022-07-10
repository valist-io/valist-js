import { 
  AppShell as MantineAppShell,
  useMantineTheme,
} from '@mantine/core';

import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

interface AppShellProps {
  children?: React.ReactNode;
  footer?: React.ReactElement;
  navbar?: React.ReactElement;
  header?: React.ReactElement;
}

export function AppShell(props: AppShellProps) {
  const theme = useMantineTheme();
  const showFooter = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false);
  const backgroundColor = theme.colorScheme === 'dark'
    ? theme.colors.dark[9]
    : theme.colors.gray[1];

  return (
    <MantineAppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      padding="md"
      footer={showFooter ? props.footer : undefined}
      navbar={props.navbar}
      header={props.header}
      styles={{ main: { backgroundColor } }}
      fixed
    >
      { props.children }
    </MantineAppShell>
  );
}
