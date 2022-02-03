import '../styles/globals.css';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { Client, Contract, Storage} from '@valist/sdk';
import { create } from "ipfs-http-client";
import { ethers } from 'ethers';
import { ApolloProvider } from '@apollo/client';
import { Magic } from 'magic-sdk';

import AccountContext from '../components/Accounts/AccountContext';
import ValistContext from '../components/Valist/ValistContext';
import { LoginType, ValistProvider } from '../utils/Account/types';
import { login, onAccountChanged } from '../utils/Account/index';
import LoginForm from '../components/Accounts/LoginForm';
import { newMagic } from '../utils/Providers';
import client from "../utils/Apollo/client";

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

  const valistState = {
    valist: new Client(
      new Contract.EVM(
        '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab', 
        provider
      ),
      new Storage.IPFS(create(publicRuntimeConfig.IPFS_GATEWAY)),
    ),
    ipfsGateway: publicRuntimeConfig.IPFS_GATEWAY,
  }

  useEffect(() => {
    setMagic(newMagic());
  }, [setMagic]);

  useEffect(() => {
    const _loginType = (localStorage.getItem('loginType') as LoginType) || 'readOnly';
    
    login(_loginType, setLoginType, setProvider, setAddress, setMagic, '');
    onAccountChanged(setLoginType, setProvider, setAddress, '');
  }, []);

  useEffect(() => console.log("Address:", address), [address]);

  return (
    <ApolloProvider client={client}>
      <AccountContext.Provider value={accountState}>
        <ValistContext.Provider value={valistState}>
          <Component {...pageProps} />
          {showLogin && <LoginForm 
            setProvider={setProvider}
            setAddress={setAddress}
          />}
        </ValistContext.Provider>
      </AccountContext.Provider>
    </ApolloProvider>
  );
}

export default ValistApp;
