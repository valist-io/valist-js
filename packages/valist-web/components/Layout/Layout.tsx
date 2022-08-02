import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import { AccountSelect } from '@/components/AccountSelect';
import { AccountContext } from '@/components/AccountProvider';

import { 
  Anchor,
  ActionIcon,
} from '@mantine/core';

import { 
  AppShell,
  Breadcrumbs,
  Footer,
  Navbar,
  Header,
  Social,
  ThemeButton,
} from '@valist/ui';

export interface Breadcrumb {
  title: string;
  href: string;
}

export interface LayoutProps {
  children?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export function Layout(props: LayoutProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  const { account } = useContext(AccountContext);
  const showNavbar = !!account;

  return (
    <AppShell
      showNavbar={showNavbar}
      header={
        <Header 
          showNavbar={showNavbar}
          opened={opened} 
          onClick={() => setOpened(!opened)}
          onSearch={value => router.push(`/-/search/${value}`)}
        >
          <Anchor target="_blank" href="https://docs.valist.io">Docs</Anchor>
          <Anchor href="/-/discover">Discover</Anchor>
          <ConnectButton 
            chainStatus="icon" 
            accountStatus="address" 
            showBalance={false}
          />
          <ActionIcon component={NextLink} href="/-/gas" variant="transparent">
            <Icons.GasStation size={18} />
          </ActionIcon>
          <ThemeButton />
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
          <ConnectButton 
            chainStatus="full" 
            accountStatus="full" 
            showBalance={false} />
        </Footer>
      }
    >
      {props.breadcrumbs && 
        <div style={{ paddingBottom: 32 }}>
          <Breadcrumbs items={props.breadcrumbs} />
        </div>
      }
      {props.children}
    </AppShell>
  ); 
}