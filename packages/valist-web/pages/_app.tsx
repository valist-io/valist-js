import '../styles/globals.css';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import AccountContext from '../components/Accounts/AccountContext';
import { LoginType, ValistProvider } from '../utils/Account/types';
import { login, onAccountChanged } from '../utils/Account/index';
import LoginForm from '../components/Accounts/LoginForm';
import { Magic } from 'magic-sdk';
import { newMagic } from '../utils/Providers';

function ValistApp({ Component, pageProps }: AppProps) {
  const { publicRuntimeConfig } = getConfig();
  const [provider, setProvider] = useState<ValistProvider>(
    new ethers.providers.JsonRpcProvider(
      publicRuntimeConfig.WEB3_PROVIDER,
    ),
  );
  const [magic, setMagic] = useState<Magic | null>(null);
  const [address, setAddress] = useState<string>('0x0');
  const [loginType, setLoginType] = useState<LoginType>('readOnly');
  const [showLogin, setShowLogin] = useState(false);

  const accountState = {
    magic,
    address,
    loginType,
    setLoginType,
    setShowLogin,
    setAddress,
    setMagic,
  };

  useEffect(() => {
    setMagic(newMagic());
  }, []);

  useEffect(() => {
    const _loginType = (localStorage.getItem('loginType') as LoginType) || 'readOnly';
    
    login(_loginType, setLoginType, setProvider, setAddress, setMagic, '');
    onAccountChanged(setLoginType, setProvider, setAddress, '');
  }, []);

  useEffect(() => console.log("Address:", address), [address]);
  
  return (
    <AccountContext.Provider value={accountState}>
      <Component {...pageProps} />
      {showLogin && <LoginForm 
        setProvider={setProvider}
        setAddress={setAddress}
      />}
    </AccountContext.Provider>
  );
}

export default ValistApp;
