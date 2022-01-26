import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { LoginType } from '../../utils/Account/types';
import { checkLoggedIn } from '../../utils/Account/index';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import { ActionItem } from './types';

interface NavDropdownProps {
  actions: ActionItem[]
  loginType: LoginType,
  address: string,
}

const NavDropdown = (props: NavDropdownProps): JSX.Element => {
  return (
    <Menu as="div" className="flex-shrink-0 relative ml-5">
      <div>
        <Menu.Button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <AddressIdenticon height={36} address={props.address} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
          {props.actions.map((item) => (
            <Menu.Item key={item.name}>
                {({}) => (
                  <Fragment>
                    {checkLoggedIn(item.isLoggedIn, props.loginType) && item.href != '' &&
                      <a
                        href={item.href}
                        onClick={() => {item.action();}}
                        className='block py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100'
                      >
                        {item.name}
                      </a>
                    }
                    {checkLoggedIn(item.isLoggedIn, props.loginType) && item.href === '' &&
                      <div
                      onClick={() => {item.action();}}
                      className='block py-2 px-4 text-sm text-gray-700 cursor-pointer hover:bg-gray-100'
                    >
                      {item.name}
                    </div>
                    }
                  </Fragment>
                )}
            </Menu.Item>))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NavDropdown;