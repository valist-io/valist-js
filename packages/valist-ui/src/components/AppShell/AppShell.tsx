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
  padding?: number;
}

export function AppShell(props: AppShellProps) {
  const theme = useMantineTheme();
  const showFooter = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false);

  return (
    <MantineAppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      padding={0}
      footer={showFooter ? props.footer : undefined}
      navbar={props.navbar}
      header={props.header}
      fixed
    >
      <div style={{ padding: props.padding >= 0 ? props.padding : 40}}>
        { props.children }
      </div>
    </MantineAppShell>
  );
}
