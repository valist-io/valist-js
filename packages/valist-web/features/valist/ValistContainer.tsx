/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, selectAddress, selectLoginType, setAccounts, setAddress, setCurrentAccount, setLoading, setMagicAddress } from '../accounts/accountsSlice';
import { useEffect, useState } from 'react';
import { Client, createReadOnly } from '@valist/sdk';
import { USER_HOMEPAGE_QUERY } from '@valist/sdk/dist/graphql';
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
import { useQuery, gql } from '@apollo/client';

import { normalizeUserProjects } from '../../utils/Apollo/normalization';
import { Toaster } from 'react-hot-toast';
import getConfig from 'next/config';
import { useAccount, useSigner } from 'wagmi';

export default function ValistContainer({ children }: any) {
  const isModal = useAppSelector(selectIsOpen);

  const dispatch = useAppDispatch();
  const { publicRuntimeConfig } = getConfig();
  const [provider, setProvider] = useState<ValistProvider>(defaultProvider);
  const { data: account } = useAccount();
  const { data: signer, isError, isLoading } = useSigner();

  const [valistClient, setValistClient] = useState<Client>(
    createReadOnly(provider,
    {
      chainId: Number(publicRuntimeConfig.CHAIN_ID),
    },
  ));

  const [mainnet, setMainnet] = useState<JsonRpcProvider>(new ethers.providers.JsonRpcProvider('https://rpc.valist.io/ens'));
  const [magic, setMagic] = useState<Magic>(newMagic());

  const { data, loading, error } = useQuery(gql(USER_HOMEPAGE_QUERY), {
    variables: { address: account?.address?.toLowerCase() },
  });

  // Signal to APP Components that user data has been loaded
  useEffect(() => {
    dispatch(setLoading(loading));
  }, [account?.address]);
  
  // Set Valist client on provider change.
  useEffect(() => {
    (async () => {
      if (signer?.provider && !isLoading) {
        const client = await createValistClient(signer.provider as any);
        dispatch(setAddress(await signer?.getAddress()));
        if (client) setValistClient(client);
      }
    })();
  }, [signer, isLoading]);

  // Add Valist client to window
  useEffect(() => {
    window.valist = valistClient;
  }, [valistClient]);

  // Log current address
  useEffect(() => console.log("Address:", account?.address), [account?.address]);

  // Set User's teams and associated projects
  useEffect(() => {
    if (data?.users[0]) {
      const { teamNames, teams } = normalizeUserProjects(
        data.users[0].accounts,
        data.users[0].projects,
      );

      dispatch(setAccounts({
        accounts: teams,
        accountNames: teamNames,
      }));

      dispatch(setLoading(loading));
    }
  }, [data]);

    // Load and set currentAccount if saved in local storage
    useEffect(() => {
      if (account?.address) {
        const savedAccounts = JSON.parse(localStorage.getItem('currentAccount') || '[]');
        dispatch(setCurrentAccount(savedAccounts[account?.address]));
      }
    }, [account?.address, dispatch]);

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
