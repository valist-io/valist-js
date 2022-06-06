import { Popover } from "@headlessui/react";
import { truncate } from "../../utils/Formatting/truncate";
import AddressIdenticon from "../Identicons/AddressIdenticon";
import { Fragment } from "react";
import { LoginType } from "../../utils/Account/types";
import { checkLoggedIn } from "../../utils/Account";
import { ActionItem, NavItem } from "./types";

interface MobileMenuProps {
  actions: ActionItem[],
  navigation: NavItem[],
  address: string,
  loginType: LoginType,
}

export default function MobileMenu(props: MobileMenuProps):JSX.Element {
  return (
    <div className="lg:hidden" aria-label="Global">
      <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
        {props.navigation.map((item: NavItem) => (
          <a
            key={item.name}
            href={item.href}
            className='hover:bg-gray-200 block rounded-md py-2 px-3 text-base'
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="border-t border-gray-200 pt-4 pb-3">
        <div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
          <div className="flex-shrink-0">
            <AddressIdenticon height={35} width={35} address={props.address} />
          </div>
          <div className="ml-3">
            <div className="text-base font-medium text-gray-800">{truncate(props.address, 10)}</div>
          </div>
          <button
            type="button"
            className="ml-auto flex-shrink-0 bg-white rounded-full p-1 
            text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-indigo-500"
          >
          </button>
        </div>
        <div className="mt-3 max-w-3xl mx-auto px-2 space-y-1 sm:px-4">
          {props.actions.map((item: ActionItem) => (
            <Fragment key={item.name}>
              {checkLoggedIn(item.isLoggedIn, props.loginType) && item.isMobile && item.href != '' &&
                <a
                  href={item.href}
                  onClick={() => item.action() }
                  className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 
                  hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </a>
              }
              {checkLoggedIn(item.isLoggedIn, props.loginType) && item.isMobile && item.href === '' &&
                <div
                  key={item.name}
                  onClick={() => item.action() }
                  className="block rounded-md py-2 px-3 text-base font-medium text-gray-500 
                  hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </div>
              }
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};