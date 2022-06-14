import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { AppShell, useMantineTheme } from '@mantine/core';
import Navbar from './Navbar';
import Header from './Header';

interface LayoutProps {
  children?: ReactNode,
  title?: string,
  description: string,
  image: string,
  video?: string,
  url: string,
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

        {/* Basic Tags */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="title" content={props.title} />
        <meta name="description" content={props.description} />

        {/* Twitter Tags */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:domain" content='valist.io' />
        <meta property="twitter:url" content={`https://${props.url}`} />
        <meta property="twitter:title" content={props.title} />
        <meta property="twitter:description" content={props.description} />
        <meta property="twitter:image" content={props.image} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={props.title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${props.url}`} />
        <meta property={props.video ? "og:video" : "og:image"} content={props.video || props.image} />
        <meta property="og:description" content={props.description} />
      </Head>
      <AppShell
        fixed
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        padding="md"
        navbar={<Navbar opened={opened} />}
        header={<Header opened={opened} onBurger={() => setOpened(!opened)} />}
        styles={(theme) => ({ main: { backgroundColor } })}
      >
        { props.children }
      </AppShell>
    </React.Fragment>
  );
};