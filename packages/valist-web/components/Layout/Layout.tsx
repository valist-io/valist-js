import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { AccountSelect } from '@/components/AccountSelect';
import { AccountContext } from '@/components/AccountProvider';

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
import { NextLink } from '@mantine/next';

export interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
  hideNavbar?: boolean;
  padding?: number;
}

export function Layout(props: LayoutProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const { account } = useContext(AccountContext);

  const isMobile = useMediaQuery('(max-width: 800px)', false);
  const hideNavbar = !account || props.hideNavbar;

  const [isElectron, setIsElectron] = useState(false);
  useEffect(() => {if(window?.valist) setIsElectron(true);}, []);

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
          <Anchor target="_blank" href="https://docs.valist.io">Docs</Anchor>
          <Anchor href="/-/discover">Discover</Anchor>
          <ConnectButton chainStatus="icon" showBalance={false} />
          {!isMobile && 
            <ActionIcon component={NextLink} href="/-/gas" variant="transparent">
              <Icons.GasStation size={18} />
            </ActionIcon>
          }
        </Header>
      }
      navbar={
        <Navbar opened={opened}>
          <Navbar.Section grow>
            <div style={{ margin: '20px 0 10px 30px' }}>
              <AccountSelect />
            </div>
            <Navbar.Link 
              icon={Icons.Apps} 
              text="Dashboard"
              href="/"
              active={router.asPath === "/"} 
            />
            <Navbar.Link 
              icon={Icons.Settings} 
              text="Settings"
              href={`/-/account/${account?.name}/settings`}
              active={router.asPath === `/-/account/${account?.name}/settings`} 
            />
            {isElectron && <Navbar.Link 
              icon={Icons.Apps} 
              text="Library"
              href={`/-/library`}
              active={router.asPath === `/-/library`} 
            />}
            {isMobile &&
              <>
                <Navbar.Link 
                  icon={Icons.DeviceGamepad2} 
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
