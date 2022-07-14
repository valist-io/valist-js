import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import { Select } from './Select';

import { 
  Anchor,
  AppShell,
  Footer,
  Navbar,
  Header,
  Social,
} from '@valist/ui';

export interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout(props: LayoutProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      header={
        <Header 
          opened={opened} 
          onClick={() => setOpened(!opened)}
        >
          <Anchor>Docs</Anchor>
          <Anchor>Discover</Anchor>
          <ConnectButton 
            chainStatus="icon" 
            accountStatus="avatar" 
            showBalance={false}
          />
        </Header>
      }
      navbar={
        <Navbar opened={opened}>
          <Navbar.Section grow>
            <div style={{ margin: '20px 0 10px 30px' }}>
              <Select />
            </div>
            <NextLink href="/">
              <Navbar.Link 
                icon={Icons.Apps} 
                text="Dashboard" 
                active={router.asPath === "/"} 
              />
            </NextLink>
            <NextLink href="/-/settings">
              <Navbar.Link 
                icon={Icons.Settings} 
                text="Settings" 
                active={router.asPath === "/-/settings"} 
              />
            </NextLink>
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
      {props.children}
    </AppShell>
  ); 
}