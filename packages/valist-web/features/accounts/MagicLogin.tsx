import { useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { LoginType, SetUseState } from '../../utils/Account/types';
import Web3Context from '../valist/Web3Context';
import { logout, selectLoginType, selectMagicAddress } from './accountsSlice';

interface MagicLoginProps {
  login: (loginType: LoginType) => Promise<void>,
  setEmail: SetUseState<string>,
};

export default function MagicLogin(props: MagicLoginProps) {
  const web3Ctx = useContext(Web3Context);
  const loginType = useAppSelector(selectLoginType);
  const magicAddress = useAppSelector(selectMagicAddress)
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(logout(
      {
        magic: web3Ctx?.magic,
        setProvider: web3Ctx.setValist,
      }
    ));
  };

  if (magicAddress && loginType !== "magic") {
    return (
      <div>
        <span className="w-full inline-flex rounded-md shadow-sm">
          <button onClick={async () => props.login('magic')} type="button"
            className="w-full inline-flex justify-center py-2 px-4 border
            border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
            text-gray-500 hover:text-gray-400 focus:outline-none
            focus:border-blue-300 focus:shadow-outline-blue transition
            duration-150 ease-in-out" aria-label="Sign in with Magic">
              {magicAddress}
          </button>
        </span>
      </div>
    );
  }

  if (magicAddress && loginType === "magic") {
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
};