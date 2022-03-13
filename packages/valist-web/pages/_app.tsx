import '../styles/globals.css';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { Client } from '@valist/sdk';
import { ethers } from 'ethers';
import { ApolloProvider } from '@apollo/client';
import { Magic } from 'magic-sdk';
import toast, { Toaster } from "react-hot-toast";

import AccountContext from '../components/Accounts/AccountContext';
import ValistContext, { createValistClient, defaultProvider  } from '../components/Valist/ValistContext';
import { LoginType, ValistProvider } from '../utils/Account/types';
import { login, onAccountChanged } from '../utils/Account/index';
import LoginModal from '../components/Accounts/LoginModal';
import { addNetwork, newMagic } from '../utils/Providers';
import client from "../utils/Apollo/client";

function ValistApp({ Component, pageProps }: AppProps) {
  const { publicRuntimeConfig } = getConfig();
  const [provider, setProvider] = useState<ValistProvider>(defaultProvider);
  const [valistClient, setValistClient] = useState<Client>(createValistClient(defaultProvider));
  const [magic, setMagic] = useState<Magic | null>(null);
  const [address, setAddress] = useState<string>('0x0');
  const [loginType, setLoginType] = useState<LoginType>('readOnly');
  const [loginTried, setLoginTried] = useState<boolean>(false);
  const [loginSuccessful, setLoginSuccessful] = useState<Boolean>(false);
  const [showLogin, setShowLogin] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [mainnet, setMainnet] = useState<ethers.providers.JsonRpcProvider>(new ethers.providers.JsonRpcProvider('https://rpc.valist.io/ens'));

  const notify = (type: string, text?: string): string => {
    switch (type) {
      case 'transaction':
        return toast.custom(() => (
          <div className='toast'>
           Transaction pending: <a className="text-indigo-500 cursor-pointer" target="_blank" rel="noreferrer" href={`https://polygonscan.com/tx/${text}`}>view on block explorer </a>
          </div>
        ), {
          position: 'top-right',
          duration: 1000000,
        });
      case 'pending':
        return toast.custom(() => (
          <div className='toast'>
           Creating transaction..
          </div>
        ), {
          position: 'top-right',
          duration: 1000000,
        });
      case 'message':
        return toast.success(`${text}`, {
          position: 'top-right',
        });
      case 'success':
        return toast.success('Transaction Successfull!', {
          position: 'top-right',
        });
      case 'text':
        return toast.custom(() => (
          <div className='toast'>
            {text}
          </div>
        ), {
          position: 'top-right',
          duration: 1000000,
        });
      case 'error':
        return toast(`${text}`, {
          position: 'top-right',
          style: {
            backgroundColor: '#ff6961',
            wordBreak: 'break-word',
            overflow: 'hidden',
          },
        });
    }
    return '';
  };

  const dismiss = (id: string) => {
    toast.dismiss(id);
  };

  const reverseEns = async (address: string) => {
    try {
      const name = await mainnet.lookupAddress(address);
      if (name !== null) {
        return name;
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  const resolveEns = async (ens: string) => {
    try {
      const name = await mainnet.resolveName(ens);
      if (name !== null) {
        return name;
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  const resolveAddress = async (addressOrENS: string) => {
    let address: string | null = addressOrENS;
    if (address.endsWith('.eth')) {
      address = await resolveEns(address);
    }
    const isAddress = address && ethers.utils.isAddress(address);

    if (isAddress) return address;

    return null;
  };
  
  const accountState = {
    magic,
    provider,
    address,
    loginType,
    loginTried,
    loginSuccessful,
    modal,
    reverseEns,
    resolveEns,
    resolveAddress,
    setLoginType,
    setShowLogin,
    setLoginTried,
    setProvider,
    setAddress,
    setMagic,
    notify,
    dismiss,
    setModal,
  };

  useEffect(() => {
    setMagic(newMagic());
  }, [setMagic]);

  useEffect(() => {
    const _loginType = (localStorage.getItem('loginType') as LoginType) || 'readOnly';
  
    login(_loginType, setLoginType, setProvider, setAddress, setLoginTried, setMagic, '');
    onAccountChanged(setLoginType, setProvider, setAddress, setLoginTried, '');
  }, []);

  useEffect(() => {
    setValistClient(createValistClient(provider));
  }, [provider, publicRuntimeConfig]);

  useEffect(() => {
    // @ts-ignore
    window.valist = valistClient;
  }, [valistClient]);

  useEffect(() => {
    (async () => {
      const { chainId } = await provider.getNetwork();
      if (chainId != publicRuntimeConfig.CHAIN_ID) {
        notify('error', 'Incorrect network. Please switch to Polygon Mainnet https://polygon-rpc.com');
        await addNetwork(provider, 'polygon');
      }
    })();
  }, [provider, publicRuntimeConfig.CHAIN_ID]);

  // Check if login is successful
  useEffect(() => {
    if( loginType !== 'readOnly') {
      setLoginSuccessful(true);
    }
  }, [loginType]);

  useEffect(() => console.log("Address:", address), [address]);

  return (
    <ApolloProvider client={client}>
      <AccountContext.Provider value={accountState}>
        <ValistContext.Provider value={valistClient}>
          <Component {...pageProps} />
          {showLogin && <LoginModal />}
          <Toaster />
        </ValistContext.Provider>
      </AccountContext.Provider>
    </ApolloProvider>
  );
}

export default ValistApp;
