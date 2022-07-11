import React, { useState, useContext } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { AccountContext } from '@/components/AccountProvider';

import { 
  AccountModal,
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
  const [mobileOpened, setMobileOpened] = useState(false);
  const [accountOpened, setAccountOpened] = useState(false);
  const { accounts, account, setAccount } = useContext(AccountContext);

  const changeAccount = (account: string) => {
    setAccount(account);
    setAccountOpened(false);
  };

  return (
    <AppShell
      header={
        <Header opened={mobileOpened} onClick={() => setMobileOpened(!mobileOpened)}>
          <Anchor>Docs</Anchor>
          <Anchor>Discover</Anchor>
          <ConnectButton 
            chainStatus="icon" 
            accountStatus="avatar" 
            showBalance={false} />
        </Header>
      }
      navbar={
        <Navbar opened={mobileOpened}>
          <Navbar.Section grow>
            {account && 
              <div style={{ margin: '20px 0 10px 30px' }}>
                <AccountPicker 
                  account={account}
                  onClick={() => setAccountOpened(true)}
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
      <AccountModal
        accounts={accounts}
        onChange={changeAccount}
        opened={accountOpened}
        onClose={() => setAccountOpened(false)}
      >
      </AccountModal>
      {props.children}
    </AppShell>
  ); 
}