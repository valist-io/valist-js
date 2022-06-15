import React, { ReactNode, useState } from 'react';
import { AppShell, Footer, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import Head from 'next/head';
import Navbar from './Navbar';
import Header from './Header';

interface LayoutProps {
  children?: ReactNode,
  title?: string,
};

export default function Layout(props: LayoutProps): JSX.Element {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const showFooter = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false);
  const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1];

  const footer = (
    <Footer height={60} py="xs" px="md" style={{ backgroundColor }}>
      <ConnectButton showBalance={false} />
    </Footer>
  );

  return (
    <React.Fragment>
      <Head>
        <title>{props.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppShell
        fixed
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        padding="md"
        footer={showFooter ? footer : undefined}
        navbar={<Navbar opened={opened} />}
        header={<Header opened={opened} onBurger={() => setOpened(!opened)} />}
        styles={(theme) => ({ main: { backgroundColor } })}
      >
        { props.children }
      </AppShell>
    </React.Fragment>
  );
};