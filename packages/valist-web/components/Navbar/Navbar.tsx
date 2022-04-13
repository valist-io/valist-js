/* eslint-disable @next/next/no-img-element */
import { Popover } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import NavDropdown from './NavDropdown';
import SearchBar from './Searchbar';
import MobileMenu from './MobileMenu';
import { classNames } from '../../utils/Styles';
import { truncate } from '../../utils/Formatting/truncate';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectAddress, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { useContext } from 'react';
import Web3Context from '../../features/valist/Web3Context';

export default function Navbar() {
  const address = useAppSelector(selectAddress);
  const loginType = useAppSelector(selectLoginType);
  const webCtx = useContext(Web3Context);
  const dispatch = useAppDispatch();

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
    <>
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
            'bg-white shadow-md lg:sticky lg:overflow-y-visible top-0 z-50',
          )
        }
      >
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
              <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                  <div className="flex-shrink-0 flex items-center">
                    <Link href="/" >
                      <a>
                        <img
                          className="block h-8 w-auto"
                          src="/images/valistlogo128.png"
                          alt="Valist"
                        />
                      </a>
                    </Link>
                  </div>
                </div>

                <SearchBar />

                <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>

                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a className="ml-5 font-bold flex-shrink-0 bg-white rounded-full p-1 text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  <NavDropdown loginType={loginType} address={address} actions={dropdownItems} />
                </div>
              </div>
            </div>
            <MobileMenu loginType={loginType} actions={dropdownItems} navigation={navItems} address={address} />
          </>
        )}
      </Popover>
    </>
  );
}