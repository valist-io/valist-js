import React, { useState, useEffect } from 'react';
import { WalletModal } from '@valist/ui';
import { ethers } from 'ethers';

export const WalletContext = React.createContext({
  openWallet: () => {},
  hideWallet: () => {},
});

export interface WalletProviderProps {
  children?: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const [request, setRequest] = useState<any>();
  const [selected, setSelected] = useState<string>();
  const [accounts, setAccounts] = useState<string[]>([]);

  const openWallet = () => setOpened(true);
  const hideWallet = () => setOpened(false);

  const selectAccount = (account: string) => {
    setSelected(account);
    window?.sapphire?.request({ method: 'wallet_switchAccount', params: [account] });
  };

  const approveSigning = () => {
    setLoading(true);
    window?.sapphire?.request({ method: 'wallet_approveSigning' })
      .then(() => setRequest(undefined))
      .finally(() => setLoading(false));
  };

  const rejectSigning = () => {
    setLoading(true);
    window?.sapphire?.request({ method: 'wallet_rejectSigning' })
      .then(() => setRequest(undefined))
      .finally(() => setLoading(false));
  };

  const generateAccount = () => {
    const account = ethers.Wallet.createRandom();
    return account.mnemonic.phrase;
  };

  const createAccount = async (mnemonic: string) => {
    await window?.sapphire?.request({ method: 'wallet_createAccount', params: [mnemonic] });
    await window?.sapphire?.request({ method: 'wallet_listAccounts' }).then(setAccounts);
  };

  useEffect(() => {
    window?.sapphire?.on('openWallet', openWallet);
    window?.sapphire?.on('hideWallet', hideWallet);

    window?.sapphire?.request({ method: 'wallet_listAccounts' }).then(setAccounts);
    window?.sapphire?.request({ method: 'eth_accounts' }).then((accts: string[]) => {
      if (accts.length > 0) setSelected(accts[0]);
    });

    const signingId = setInterval(() => {
      window?.sapphire?.request({ method: 'wallet_signingRequest' }).then(setRequest);
    }, 1000);

    return () => {
      clearInterval(signingId);
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
        loading={loading}
        onClose={() => setOpened(false)}
        request={request}
        onApprove={approveSigning}
        onReject={rejectSigning}
        generate={generateAccount}
        onCreate={createAccount}
      />
      {props.children}
    </WalletContext.Provider>
  );
}