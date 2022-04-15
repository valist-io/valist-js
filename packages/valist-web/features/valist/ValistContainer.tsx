/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, selectAccountNames, selectAddress, selectLoginType, setAccounts, setCurrentAccount, setMagicAddress } from '../accounts/accountsSlice';
import { useEffect, useState } from 'react';
import { Client } from '@valist/sdk';
import { createValistClient } from '../../utils/Account';
import { addressFromProvider, defaultProvider, newMagic } from '../../utils/Providers';
import { LoginType, ValistProvider } from '../../utils/Account/types';
import ValistContext from '../valist/ValistContext';
import { Magic } from 'magic-sdk';
import { selectIsOpen } from '../modal/modalSlice';
import Modal from '../modal/Modal';
import Web3Context, { Web3ContextInstance } from './Web3Context';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { useQuery } from '@apollo/client';
import { USER_HOMEPAGE } from '../../utils/Apollo/queries';
import { normalizeUserProjects } from '../../utils/Apollo/normalization';
import { Toaster } from 'react-hot-toast';

export default function ValistContainer({ children }: any) {
  const accountNames  = useAppSelector(selectAccountNames);
  const loginType = useAppSelector(selectLoginType);
  const isModal = useAppSelector(selectIsOpen);
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();

  const [valistClient, setValistClient] = useState<Client>(createValistClient(defaultProvider));
  const [provider, setProvider] = useState<ValistProvider>(defaultProvider);
  const [mainnet, setMainnet] = useState<JsonRpcProvider>(new ethers.providers.JsonRpcProvider('https://rpc.valist.io/ens'));
  const [magic, setMagic] = useState<Magic>(newMagic());

  const { data, loading, error } = useQuery(USER_HOMEPAGE, {
    variables: { address: address.toLowerCase() },
  });
  
  // Dispatch login to redux on app load
  useEffect(() => {
    dispatch(
      login({
        loginType, setProvider, setMagic,
      }),
    );

    // Listen for account or network change
    if (loginType === 'metaMask') {
      ['accountsChanged', 'chainChanged'].forEach((event) => {
        window.ethereum.on(event, () => {
          const loginType = (localStorage.getItem('loginType') as LoginType);
          if (loginType === 'metaMask') dispatch(login({ loginType, setProvider }));
        });
      });
    }
  }, []);
  
  // Set Valist client on provider change.
  useEffect(() => {
    setValistClient(createValistClient(provider));
  }, [provider]);

  // Add Valist client to window
  useEffect(() => {
    window.valist = valistClient;
  }, [valistClient]);

  // Log current address
  useEffect(() => console.log("Address:", address), [address]);

  // Set User's teams and associated projects
  useEffect(() => {
    if (data?.users[0]) {
      const { teamNames, teams } = normalizeUserProjects(
        data.users[0].teams,
        data.users[0].projects,
      );

      dispatch(setAccounts({
        accounts: teams,
        accountNames: teamNames,
      }));
    }
  }, [data]);

  // Load and set currentAccount if saved in local storage
  useEffect(() => {
    const savedAccounts = JSON.parse(localStorage.getItem('currentAccount') || '[]');
    dispatch(setCurrentAccount(savedAccounts[address]));
  }, [address, dispatch]);

  // Check if magic session is active
  useEffect(() => {
    (async () => {
      const isLoggedIn = await magic.user.isLoggedIn();

      if (isLoggedIn) {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const address = await addressFromProvider(provider);
        dispatch(setMagicAddress(address));
      }
    })();
  }, [magic]);

  const web3Ctx: Web3ContextInstance = new Web3ContextInstance(
    provider,
    mainnet,
    magic,
    setProvider,
    setMainnet,
    setMagic,
  );

  return (
    <Web3Context.Provider value={web3Ctx}>
      <ValistContext.Provider value={valistClient}>
        <Toaster />
        {isModal && <Modal />}
        {children}
      </ValistContext.Provider>
    </Web3Context.Provider>
  );
};
