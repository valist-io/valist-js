import React, { useState, useContext } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { AccountContext } from '@/components/AccountProvider';

import { 
  AccountPicker,
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
  const [opened, setOpened] = useState(false);
  const { account } = useContext(AccountContext);

  return (
    <AppShell
      header={
        <Header opened={opened} onClick={() => setOpened(!opened)}>
          <Anchor>Docs</Anchor>
          <Anchor>Discover</Anchor>
          <ConnectButton 
            chainStatus="icon" 
            accountStatus="avatar" 
            showBalance={false} />
        </Header>
      }
      navbar={
        <Navbar opened={opened}>
          <Navbar.Section grow>
            {account && 
              <div style={{ margin: '20px 0 10px 30px' }}>
                <AccountPicker 
                  account={account}
                />
              </div>
            }
            <Navbar.Link 
              icon={Icons.Apps} 
              text="Dashboard" 
              href="/" 
              active />
            <Navbar.Link 
              icon={Icons.FileText}
              text="Projects" 
              href="/" />
            <Navbar.Link 
              icon={Icons.Users}
              text="Members" 
              href="/" />
            <Navbar.Link 
              icon={Icons.Hourglass}
              text="Activity" 
              href="/" />
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