import React, { useState, useEffect, useContext } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useQuery, gql } from '@apollo/client';
import { AccountMeta } from '@valist/sdk';
import useSWRImmutable from 'swr/immutable';

export interface Account {
  id: string;
  name: string;
  metaURI: string;
}

export interface IAccountContext {
  account?: Account;
  setAccount: (account?: Account) => void;
  accountNames: string[];
  accountMeta?: AccountMeta;
}

export const AccountContext = React.createContext<IAccountContext>({
  account: undefined,
  setAccount: (account: Account) => (void 0),
  accounts: [],
});

export interface AccountProviderProps {
  children?: React.ReactNode;
}

export const query = gql`
  query UserAccounts($address: String!){
    user(id: $address) {
      accounts(orderBy: name) {
        id
        name
        metaURI
        projects(orderBy: name) {
          id
          name
          metaURI
        }
      }
    }
  }
`;

export function AccountProvider(props: AccountProviderProps) {  
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [account, setAccount] = useState<Account>(null);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);
  const { data: accountQuery } = useQuery(query, {
    variables: { address: address?.toLowerCase() },
  });

  console.log('accountQuery', accountQuery)
  const accounts = accountQuery?.user?.accounts ?? [];

  // reset account when chain id or address changes
  useEffect(() => {
    setAccount(null);
  }, [chain?.id, address]);

  // make sure a default account is selected
  if (!account && accounts.length > 0) {
    setAccount(accounts[0]);
  }

  return (
    <AccountContext.Provider 
      value={{ account, setAccount, accounts, accountMeta }}
    >
      {props.children}
    </AccountContext.Provider>
  );
}