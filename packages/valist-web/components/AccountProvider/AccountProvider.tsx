import React, { useState } from 'react';

interface AccountContextParams {
  account: string;
  setAccount: (account: string) => void;
}

export const AccountContext = React.createContext<AccountContextParams>({
  account: '',
  setAccount: (account: string) => void(0),
});

export interface AccountProviderProps {
  children?: React.ReactNode;
}

export function AccountProvider(props: AccountProviderProps) {
  const [account, _setAccount] = useState('');
  const setAccount = (value: string) => { 
    _setAccount(value); 
  };

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {props.children}
    </AccountContext.Provider>
  );
}