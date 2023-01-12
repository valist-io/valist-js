import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMediaQuery } from '@mantine/hooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import * as Icons from 'tabler-icons-react';
import { useAccount } from 'wagmi';
import { AccountSelect } from '@/components/AccountSelect';

import { 
  Center,
  Divider,
  Group,
  Menu,
  useMantineTheme,
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
  description?: string,
  image?: string,
  video?: string,
  url?: string,
}

export function Layout(props: LayoutProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  
  const { isConnected } = useAccount();
  const [connected, setConnected] = useState(true);

  // fix server side hydration
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  const theme = useMantineTheme();
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
                <Divider 
                  color={
                    theme.colorScheme === 'dark'
                      ? theme.colors.gray[6]
                      : theme.colors.gray[1]
                  }
                  mt={16}
                  mb={8} 
                />
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

        {/* Basic Tags */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {props.title && <meta name="title" content={props.title} />}
        {props?.description && <meta name="description" content={props.description} />}

        {/* Twitter Tags */}
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:domain" content='valist.io' />
        {props.url && <meta property="twitter:url" content={`https://${props.url}`} />}
        {props.title && <meta property="twitter:title" content={props.title} />}
        {props.description && <meta property="twitter:description" content={props.description} />}
        {props.image && <meta property="twitter:image" content={props.image} />}

        {/* Open Graph Tags */}
        {props.title && <meta property="og:title" content={props.title} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://${props.url}`} />
        {/* <meta property={props.video ? "og:video" : "og:image"} content={props.video || props.image} /> */}
        {props.description && <meta property="og:description" content={props.description} />}
      </Head>
      {props.children}
    </AppShell>
  ); 
}
