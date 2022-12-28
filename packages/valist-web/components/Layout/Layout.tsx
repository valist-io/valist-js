import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { useAccount } from 'wagmi';
import { AccountSelect } from '@/components/AccountSelect';

import { 
  Anchor,
  Center,
  Divider,
  Group,
  Menu,
} from '@mantine/core';

import { 
  AppShell,
  CircleButton,
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
  
  const { isConnected } = useAccount();
  const [connected, setConnected] = useState(false);

  // fix server side hydration
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  const isMobile = useMediaQuery('(max-width: 768px)', false);
  const hideNavbar = !isMobile && props.hideNavbar;

  const externalLinks = [
    { 
      label: 'Docs',
      href: 'https://docs.valist.io',
      icon: Icons.Notebook,
    },
    { 
      label: 'Report a bug',
      href: 'https://github.com/valist-io/valist-js/issues/new/choose',
      icon: Icons.Bug,
    },
    { 
      label: 'Have a complaint?',
      href: 'https://valist.io/discord',
      icon: Icons.MessageReport,
    },
  ];

  return (
    <AppShell
      padding={props.padding}
      hideNavbar={hideNavbar}
      header={
        <Header
          hideNavbar={hideNavbar}
          opened={opened} 
          onClick={() => setOpened(!opened)}
          onSearch={(value: string) => router.push(`/-/search/${value}`)}
        >
          <ThemeButton />
          <Menu width={200} position="bottom" withArrow>
            <Menu.Target>
              <CircleButton 
                label="Need help?"
                icon={Icons.QuestionMark}
              />
            </Menu.Target>   
            <Menu.Dropdown>
              {externalLinks.map((link, index) =>
                <Menu.Item
                  key={index}
                  component="a"
                  target="_blank"
                  icon={<link.icon size={14} />}
                  href={link.href}
                >
                  {link.label}
                </Menu.Item>,
              )}
            </Menu.Dropdown>         
          </Menu>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </Header>
      }
      navbar={
        <Navbar opened={opened}>
          <Navbar.Section mt={24} grow>
            { connected &&
              <div style={{ padding: '0 32px' }}>
                <AccountSelect />
                <Divider color="#F0F0F9" mt={16} mb={8} />
              </div>
            }
            <Navbar.Link 
              icon={Icons.World} 
              text='Discover'
              href='/'
              active={router.asPath === '/'}
            />
            <Navbar.Link 
              icon={Icons.Command} 
              text='Dashboard'
              href='/-/dashboard'
              active={router.asPath === '/-/dashboard'}
            />
            { connected &&
              <>
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
              </>
            }
            {isMobile && externalLinks.map((link, index) => 
              <Navbar.Link
                key={index}
                icon={link.icon} 
                text={link.label}
                href={link.href}
                target="_blank"
              />,
            )}
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
            <Center>
               <ConnectButton chainStatus="full" showBalance={false} />
            </Center>
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
