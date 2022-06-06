/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { truncate } from '../../utils/Formatting/truncate';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectAddress, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { useContext } from 'react';
import Web3Context from '../../features/valist/Web3Context';
import NavDropdown from './NavDropdown';
import MobileMenu from './MobileMenu';
import SearchBar from './Searchbar';
import ThemeButton from '../Theme/ThemeButton';
import { Navbar, Text, useMantineTheme } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Nav() {
  const address = useAppSelector(selectAddress);
  const loginType = useAppSelector(selectLoginType);
  const webCtx = useContext(Web3Context);
  const dispatch = useAppDispatch();

  const theme = useMantineTheme();
  const navColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : "";
  const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4];
  const linkColor = theme.colorScheme === 'dark' ? theme.white : theme.black;

  const dropdownItems = [
    {
      name: truncate(address, 5), 
      href: `/addr/${address}`,
      isLoggedIn: true,
      isMobile: false,
      action: () => {},
    },
    {
      name: 'Switch wallet',
      href: '',
      isLoggedIn: false,
      isMobile: true,
      action: () => dispatch(showLogin()),
    },
    { 
      name: 'Logout',
      href: '',
      isLoggedIn: true,
      isMobile: true,   
      action: () => dispatch(logout({ magic: webCtx.magic, setProvider: webCtx.setValist })), 
  }];

  const navItems = [
    { name: 'Discover', href: '/discover' },
    { name: 'Docs', href: 'https://docs.valist.io/' },
    { name: 'Discord', href: 'https://valist.io/discord' },
  ];

  return (
      <nav style={{ width: "100vw", position: "fixed", background: navColor, borderRight: "none", borderBottom: `1px solid ${borderColor}` }}>
        <div className="max-w-3xl mx-auto py-1 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
            <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" >
                  <a>
                    <img
                      className="block h-8 w-auto"
                      src="/images/logo.png"
                      alt="Valist"
                    />
                  </a>
                </Link>
              </div>
            </div>
            <SearchBar />
            <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
              <ThemeButton />
              {navItems.map((item) => (
                <Text key={item.name} size="sm" variant="link" component={NextLink} weight={700}  href={item.href} style={{ fontWeight: 100, textDecoration: "none", color: linkColor }} className="ml-5 flex-shrink-0 p-1">
                  {item.name}
                </Text>
              ))}
              <div style={{ marginLeft: 20 }}><ConnectButton showBalance={false} /></div>
            </div>
          </div>
        </div>
        {/* <MobileMenu loginType={loginType} actions={dropdownItems} navigation={navItems} address={address} /> */}
      </nav>
  );
}