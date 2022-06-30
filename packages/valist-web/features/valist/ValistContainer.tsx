/* eslint-disable react-hooks/exhaustive-deps */
import { 
  setAccounts, 
  setAddress, 
  setCurrentAccount, 
  setLoading,
  selectAccountNames,
} from '../accounts/accountsSlice';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useEffect, useState } from 'react';
import { Client, createReadOnly } from '@valist/sdk';
import { USER_HOMEPAGE_QUERY } from '@valist/sdk/dist/graphql';
import { createValistClient } from '../../utils/Account';
import { defaultProvider } from '../../utils/Providers';
import { ValistProvider } from '../../utils/Account/types';
import ValistContext from '../valist/ValistContext';
import Web3Context, { Web3ContextInstance } from './Web3Context';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { useQuery, gql } from '@apollo/client';

import { normalizeUserProjects } from '../../utils/Apollo/normalization';
import { Toaster } from 'react-hot-toast';
import getConfig from 'next/config';
import { useAccount, useSigner } from 'wagmi';

declare global {
  interface Window {
    valist?: Client;
  }
}

export default function ValistContainer({ children }: any) {
  const dispatch = useAppDispatch();
  const accountNames = useAppSelector(selectAccountNames);

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

  const { data, loading, error } = useQuery(gql(USER_HOMEPAGE_QUERY), {
    variables: { address: account?.address?.toLowerCase() },
  });

  // Signal to APP Components that user data has been loaded
  useEffect(() => {
    dispatch(setLoading(loading));
    dispatch(setAddress(account?.address || ''));
  }, [account]);
  
  // Set Valist client on provider change.
  useEffect(() => {
    if (signer?.provider && !isLoading) {
      console.log('signer.provider', signer?.provider);
      createValistClient(signer.provider as any).then((client) => {
        if (client) setValistClient(client);
      });
    }
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

      dispatch(setAccounts({ accounts: teams, accountNames: teamNames }));
      dispatch(setLoading(loading));
    } else {
      dispatch(setAccounts({ accounts: {}, accountNames: [] }));
    }
  }, [data]);

  // Set user account from local storage or accountNames
  useEffect(() => {
    if (accountNames.length !== 0 && account?.address) {
      const savedAccounts = JSON.parse(localStorage.getItem('currentAccount') || '[]');
      dispatch(setCurrentAccount(savedAccounts[account?.address] || accountNames[0]));
    } else {
      dispatch(setCurrentAccount(''));
    }
  }, [dispatch, accountNames, account?.address]);

  const web3Ctx: Web3ContextInstance = new Web3ContextInstance(
    mainnet,
    setMainnet,
  );

  return (
    <Web3Context.Provider value={web3Ctx}>
      <ValistContext.Provider value={valistClient}>
        <Toaster />
        {children}
      </ValistContext.Provider>
    </Web3Context.Provider>
  );
};
