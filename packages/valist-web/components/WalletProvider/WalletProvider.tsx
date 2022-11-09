import React, { useState, useEffect } from 'react';
import { WalletModal } from '@valist/ui';

export const WalletContext = React.createContext({
  openWallet: () => {},
  hideWallet: () => {},
});

export interface WalletProviderProps {
  children?: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [accounts, setAccounts] = useState<string[]>([]);

  const openWallet = () => setOpened(true);
  const hideWallet = () => setOpened(false);

  const selectAccount = (account: string) => {
    setSelected(account);
    window?.sapphire?.request({ method: 'wallet_switchAccount', params: [account] });
  };

  useEffect(() => {
    window?.sapphire?.on('openWallet', openWallet);
    window?.sapphire?.on('hideWallet', hideWallet);

    window?.sapphire?.request({ method: 'wallet_listAccounts' }).then(setAccounts);
    window?.sapphire?.request({ method: 'eth_accounts' }).then((accts: string[]) => {
      if (accts.length > 0) setSelected(accts[0]);
    });

    return () => {
      window?.sapphire?.removeListener('openWallet', openWallet);
      window?.sapphire?.removeListener('hideWallet', hideWallet);
    };
  }, []);

  return (
    <WalletContext.Provider value={{ openWallet, hideWallet }}>
      <WalletModal
        accounts={accounts}
        value={selected}
        onChange={selectAccount}
        opened={opened}
        onClose={() => setOpened(false)}
      />
      {props.children}
    </WalletContext.Provider>
  );
}