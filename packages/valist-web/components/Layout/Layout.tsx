import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { NextLink } from '@mantine/next';
import { AccountContext, Account } from '@/components/AccountProvider';

import { 
  AccountModal,
  AccountPicker,
  Anchor,
  AppShell,
  Button,
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
  const [mobileOpened, setMobileOpened] = useState(false);
  const [accountOpened, setAccountOpened] = useState(false);
  
  const { 
    account,
    accounts,
    setAccount, 
    accountMeta,
  } = useContext(AccountContext);

  const changeAccount = (name: string) => {
    setAccount(accounts.find(acc => acc.name === name));
    setAccountOpened(false);
  };

  return (
    <AppShell
      header={
        <Header 
          opened={mobileOpened} 
          onClick={() => setMobileOpened(!mobileOpened)}
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
        <Navbar opened={mobileOpened}>
          <Navbar.Section grow>
            {account && 
              <div style={{ margin: '20px 0 10px 30px' }}>
                <AccountPicker 
                  account={account.name}
                  image={accountMeta?.image}
                  onClick={() => setAccountOpened(true)}
                />
              </div>
            }
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
      <AccountModal
        accounts={accounts.map(acc => acc.name)}
        onChange={changeAccount}
        opened={accountOpened}
        onClose={() => setAccountOpened(false)}
      >
        <NextLink href="/-/create/account">
          <Button>Create Account</Button>
        </NextLink>
      </AccountModal>
      <div style={{ padding: 40 }}>
        {props.children}
      </div>
    </AppShell>
  ); 
}