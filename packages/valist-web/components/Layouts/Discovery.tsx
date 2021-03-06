import React, { ReactNode, useState } from 'react';
import { AppShell, useMantineTheme } from '@mantine/core';

import Head from 'next/head';
import Header from './Header';
import Footer from '../Footer';

interface LayoutProps {
  children?: ReactNode,
  title?: string,
};

export default function Layout(props: LayoutProps): JSX.Element {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[1];

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
        padding={0}
        header={<Header opened={opened} onBurger={() => setOpened(!opened)} />}
        footer={<Footer />}
        styles={() => ({ main: { backgroundColor } })}
      >
        { props.children }
      </AppShell>
    </React.Fragment>
  );
};