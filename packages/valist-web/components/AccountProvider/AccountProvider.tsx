import React, { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { AccountMeta } from '@valist/sdk';
import useSWRImmutable from 'swr/immutable';
import { useLocalStorage } from '@mantine/hooks';
import query from '@/graphql/UserAccounts.graphql';

export interface Account {
  id: string;
  name: string;
  metaURI: string;
  projects: any[];
}

export interface IAccountContext {
  account?: Account;
  setAccount: (name: string) => void;
  accounts: Account[];
  accountMeta?: AccountMeta;
}

export const AccountContext = React.createContext<IAccountContext>({
  account: undefined,
  setAccount: (name: string) => (void 0),
  accounts: [],
});

export interface AccountProviderProps {
  children?: React.ReactNode;
}

export function AccountProvider(props: AccountProviderProps) {  
  const { address } = useAccount();

  const [_account, setAccount] = useLocalStorage({ 
    key: 'valist.account', 
    defaultValue: '',
  });

  const { data: accountQuery } = useQuery(query, {
    variables: { address: address?.toLowerCase() ?? '' },
    returnPartialData: true,
  });

  const accounts = accountQuery?.user?.accounts ?? [];
  const account = accounts.find((other: any) => other.name === _account) 
    ?? (accounts.length > 0 ? accounts[0] : undefined);

  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  return (
    <AccountContext.Provider 
      value={{ account, setAccount, accounts, accountMeta }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}