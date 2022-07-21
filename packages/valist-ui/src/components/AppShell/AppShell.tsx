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
  showNavbar?: boolean;
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
      navbar={props.showNavbar ? props.navbar : undefined}
      header={props.header}
      fixed
    >
      <div style={{ padding: props.padding || 40 }}>
        { props.children }
      </div>
    </MantineAppShell>
  );
}

AppShell.defaultProps = {
  showNavbar: true,
};