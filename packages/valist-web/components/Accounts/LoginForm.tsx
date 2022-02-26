import React, { useEffect, useContext, useRef, useState } from 'react';
import { login } from '../../utils/Account';
import { LoginType, SetUseState, ValistProvider } from '../../utils/Account/types';
import AccountCtx from './AccountContext';
import MagicLogin from './MagicLogin';

interface LoginFormProps {
  setProvider: SetUseState<ValistProvider>, 
  setAddress: SetUseState<string>,
}

type LoginButton = {
    loginType: LoginType,
    img: string,
    spacer: boolean
}

const loginButtons:LoginButton[] = [
  { loginType: 'metaMask', img: '/images/metamask.svg', spacer: false },
  { loginType: 'readOnly', img: '', spacer: true },
  { loginType: 'walletConnect', img: '/images/walletConnect.jpeg', spacer: false },
];

const LoginForm = (props: LoginFormProps): JSX.Element => {
  const accountCtx = useContext(AccountCtx);
  const element = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState<string>('');
  
  const handleLogin = async (loginType: LoginType) => {
    login( 
        loginType,
        accountCtx.setLoginType, 
        props.setProvider,  
        props.setAddress,
        accountCtx.setMagic,
        email,
    );
    accountCtx.setShowLogin(false);
  };

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!accountCtx) return;
      if (element.current && e.target && element.current.contains(e.target)) return;
      accountCtx.setShowLogin(false);
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [accountCtx]);

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center
    justify-center" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
        <div ref={element} className="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
            <div className="text-gray-500 font-light mt-2">
                <div className="flex flex-col justify-center py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl text-indigo-500 font-bold">Select a Wallet</h1>
                    <h2>Receive a login link or choose your prefered wallet.</h2>
                    <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="py-4 sm:rounded-lg">
                            <MagicLogin setEmail={setEmail} login={handleLogin}/>
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm leading-5">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-3 space-between">
                                    {loginButtons.map((loginButton) => (
                                        <div key={loginButton.loginType}>
                                            <span className="w-full inline-flex rounded-md shadow-sm">
                                            {!loginButton.spacer && 
                                                <button onClick={async () => handleLogin(loginButton.loginType)} type="button"
                                                    className="w-full flex justify-center align-center m-auto items-center py-2 px-4 border
                                                    border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
                                                    text-gray-500 hover:text-gray-400 focus:outline-none
                                                    focus:border-blue-300 focus:shadow-outline-blue transition
                                                    duration-150 ease-in-out" aria-label="Sign in with GitHub">
                                                    <img width="85px" src={loginButton.img}/>
                                                </button>
                                            }
                                            {loginButton.spacer && 
                                                <div></div>
                                            }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LoginForm;