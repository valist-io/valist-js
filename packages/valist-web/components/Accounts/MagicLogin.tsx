import React, { useContext, useEffect, useState } from 'react';
import { logout } from '../../utils/Account';
import { LoginType, SetUseState } from '../../utils/Account/types';
import AccountCtx from './AccountContext';
import { addressFromProvider } from '../../utils/Providers';
import { ethers } from 'ethers';

interface MagicLoginProps {
  login: (loginType: LoginType) => Promise<void>,
  setEmail: SetUseState<string>,
};

export default function MagicLogin(props: MagicLoginProps) {
  const accountCtx = useContext(AccountCtx);
  const [magicAddress, setMagicAddress] = useState<string>('');
  const [magicChecked, setMagicChecked] = useState<boolean>(false);

  const handleLogout = async () => {
    logout(accountCtx.setLoginType, accountCtx.setAddress, accountCtx.magic);

    if (accountCtx.magic) {
      await accountCtx.magic.user.logout();
      setMagicAddress('');
    }
  };

  useEffect(() => {
    let magicRequest = true;

    if (magicRequest) {
      const handleMagic = async () => {
        if (accountCtx.magic) {
          if (await accountCtx.magic.user.isLoggedIn()){
            // @ts-ignore
            const provider = new ethers.providers.Web3Provider(accountCtx.magic.rpcProvider);
            const address = await addressFromProvider(provider);
            setMagicAddress(address);
          }
        }
        setMagicChecked(true);
      };
      handleMagic();
    }

    return () => {
      (magicRequest = false);
    };
  }, [accountCtx.magic, setMagicAddress, setMagicChecked]);

  if (magicChecked && accountCtx && accountCtx.loginType != "magic") {
    if (magicAddress !== '') {
      return (
        <div>
          <span className="w-full inline-flex rounded-md shadow-sm">
            <button onClick={async () => props.login('magic')} type="button"
              className="w-full inline-flex justify-center py-2 px-4 border
              border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
              text-gray-500 hover:text-gray-400 focus:outline-none
              focus:border-blue-300 focus:shadow-outline-blue transition
              duration-150 ease-in-out" aria-label="Sign in with GitHub">
                {magicAddress}
            </button>
          </span>
        </div>
      );
    }

    return (
      <div>
        <div>
            <label htmlFor="email"
            className="block text-sm font-medium leading-5 text-gray-700">
                Email address
            </label>
            <div className="mt-1 rounded-md shadow-sm">
                <input id="email" type="email"
                    onChange={(e) => props.setEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') props.login('magic'); }}
                required className="appearance-none block w-full px-3 py-2 border
                border-gray-300 rounded-md placeholder-gray-400 focus:outline-none
                focus:shadow-outline-blue focus:border-blue-300 transition duration-150
                ease-in-out sm:text-sm sm:leading-5" />
            </div>
        </div>
        <div className="mt-6">
            <span className="block w-full rounded-md shadow-sm">
                <button type="submit" onClick={ async () => await props.login('magic')}
                className="w-full flex justify-center py-2 px-4 border border-transparent
                text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500
                focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo
                active:bg-indigo-700 transition duration-150 ease-in-out">
                    Send magic link
                </button>
            </span>
        </div>
      </div>
    );
  }

  if (magicChecked) {
    return (
      <div>
        <span className="w-full inline-flex rounded-md shadow-sm">
            <button onClick={async () => handleLogout()} type="button"
              className="w-full inline-flex justify-center py-2 px-4 border
              border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
              text-gray-500 hover:text-gray-400 focus:outline-none
              focus:border-blue-300 focus:shadow-outline-blue transition
              duration-150 ease-in-out" aria-label="Sign in with GitHub">
              Disconnect magic session
            </button>
        </span>
      </div>
    );
  };

  return (
    <div className="text-center">
      Checking magic session...
    </div>
  );
};