import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { NextLink } from '@mantine/next';

import { 
  ActionIcon,
  Anchor,
  Group,
} from '@mantine/core';

import { 
  AppShell,
  Footer,
  Navbar,
  Header,
  Social,
  ThemeButton,
} from '@valist/ui';

export interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
  hideNavbar?: boolean;
  padding?: number;
}

export function Layout(props: LayoutProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const hideNavbar = !isMobile && props.hideNavbar;

  return (
    <AppShell
      padding={props.padding}
      hideNavbar={hideNavbar}
      header={
        <Header
          hideNavbar={hideNavbar}
          opened={opened} 
          onClick={() => setOpened(!opened)}
          onSearch={value => router.push(`/-/search/${value}`)}
        >
          <ThemeButton />
          <ActionIcon component={NextLink} href="/-/gas" variant="transparent">
            <Icons.GasStation size={18} />
          </ActionIcon>
          <Anchor target="_blank" href="https://docs.valist.io">Docs</Anchor>
          <Anchor href="/-/dashboard">Dashboard</Anchor>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </Header>
      }
      navbar={
        <Navbar opened={opened}>
          <Navbar.Section mt={40} grow>
            <Navbar.Link 
              icon={Icons.Users} 
              text="Members"
              href={`/-/members`}
              active={router.asPath === `/-/members`} 
            />
            <Navbar.Link 
              icon={Icons.Hourglass} 
              text="Activity"
              href="/-/activity"
              active={router.asPath === '/-/activity'} 
            />
            <Navbar.Link 
              icon={Icons.Apps} 
              text="Library"
              href={`/-/library`}
              active={router.asPath === `/-/library`} 
            />
            {isMobile &&
              <>
                <Navbar.Link 
                  icon={Icons.Notebook} 
                  text="Docs"
                  href="https://docs.valist.io"
                />
                <Navbar.Link 
                  icon={Icons.World} 
                  text="Discover"
                  href="/-/discover"
                  active={router.asPath === '/-/discover'} 
                />
                <Navbar.Link 
                  icon={Icons.GasStation} 
                  text="Gas Tank"
                  href="/-/gas"
                  active={router.asPath === '/-/gas'} 
                />
              </>
            }
          </Navbar.Section>
          <Navbar.Section px={30} py="md">
            <div style={{ display: 'flex', gap: 30 }}>
              <Social variant="discord" href="https://valist.io/discord" />
              <Social variant="twitter" href="https://twitter.com/Valist_io" />
              <Social variant="github" href="https://github.com/valist-io" />
            </div>
          </Navbar.Section>
        </Navbar>
      }
      footer={
        <Footer>
          <Group>
            <ConnectButton chainStatus="full" showBalance={false} />
          </Group>
        </Footer>
      }
    >
      <Head>
        <title>{props.title ?? 'Valist'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {props.children}
    </AppShell>
  ); 
}
