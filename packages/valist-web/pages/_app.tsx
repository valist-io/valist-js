import '../styles/globals.css';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { Client, Contract, Storage } from '@valist/sdk';
import { licenseAddresses, valistAddresses } from '@valist/sdk/dist/contract';
import { ethers } from 'ethers';
import { ApolloProvider } from '@apollo/client';
import { Magic } from 'magic-sdk';
import { create as createIPFS } from "ipfs-http-client";
import toast, { Toaster } from "react-hot-toast";

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
  const [valistClient, setValistClient] = useState<Client>(
    new Client(
      new Contract.EVM(
        { 
          valistAddress: valistAddresses[publicRuntimeConfig.CHAIN_ID],
          licenseAddress: licenseAddresses[publicRuntimeConfig.CHAIN_ID],
          metaTx: (publicRuntimeConfig.METATX_ENABLED as boolean) , 
        },
        provider,
      ),
      new Storage.IPFS(
        createIPFS(publicRuntimeConfig.IPFS_HOST),
      ),
    ),
  );
  const [magic, setMagic] = useState<Magic | null>(null);
  const [address, setAddress] = useState<string>('0x0');
  const [loginType, setLoginType] = useState<LoginType>('readOnly');
  const [showLogin, setShowLogin] = useState(false);

  const notify = (type: string, text?: string): string => {
    switch (type) {
      case 'transaction':
        return toast.loading('Transaction pending...');
      case 'success':
        return toast.success('Transaction Successfull!');
      case 'error':
        return toast(`An error has occurred: ${text}`, {
          position: 'top-right',
          style: {
            backgroundColor: '#ff6961',
          },
        });
    }
    return '';
  };

  const dismiss = (id: string) => {
    toast.dismiss(id);
  };

  const accountState = {
    magic,
    address,
    loginType,
    setLoginType,
    setShowLogin,
    setAddress,
    setMagic,
    notify,
    dismiss,
  };

  const valistState = {
    valist: valistClient,
    ipfsGateway: publicRuntimeConfig.IPFS_GATEWAY,
  };

  useEffect(() => {
    setMagic(newMagic());
  }, [setMagic]);

  useEffect(() => {
    const _loginType = (localStorage.getItem('loginType') as LoginType) || 'readOnly';
  
    login(_loginType, setLoginType, setProvider, setAddress, setMagic, '');
    onAccountChanged(setLoginType, setProvider, setAddress, '');
  }, []);

  useEffect(() => {
    setValistClient(
      new Client(
        new Contract.EVM(
          { 
            valistAddress: valistAddresses[publicRuntimeConfig.CHAIN_ID],
            licenseAddress: licenseAddresses[publicRuntimeConfig.CHAIN_ID],
            metaTx: (publicRuntimeConfig.METATX_ENABLED as boolean) , 
          },
          provider,
        ),
        new Storage.IPFS(
          createIPFS(publicRuntimeConfig.IPFS_HOST),
        ),
      ),
    );
  }, [provider, publicRuntimeConfig.CHAIN_ID, publicRuntimeConfig.IPFS_HOST, publicRuntimeConfig.METATX_ENABLED]);

  useEffect(() => {
    // @ts-ignore
    window.valist = valistClient;
  }, [valistClient]);

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
          <Toaster />
        </ValistContext.Provider>
      </AccountContext.Provider>
    </ApolloProvider>
  );
}

export default ValistApp;
