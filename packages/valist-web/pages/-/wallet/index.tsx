import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useBalance } from 'wagmi';

import { 
  Stack,
  Select,
  Text,
} from '@mantine/core';

const WalletPage: NextPage = () => {
  const [selected, setSelected] = useState<string>();
  const [accounts, setAccounts] = useState<string[]>([]);

  const { data } = useBalance({
    addressOrName: selected,
  });

  const selectAccount = (account: string) => {
    setSelected(account);
    window?.ethereum?.request({ method: 'wallet_switchAccount', params: [account] });
  };

  useEffect(() => {
    window?.ethereum?.request({ method: 'eth_accounts' }).then((accts: string[]) => {
      if (accts.length > 0) setSelected(accts[0]);
    });
    window?.ethereum?.request({ method: 'wallet_listAccounts' }).then(setAccounts);
  }, []);

  return (
    <Stack p={40}>
      <Select
        label="Account"
        placeholder="Connect an account"
        value={selected}
        data={accounts}
        onChange={selectAccount}
      />
      { data &&
        <Text>{ data.formatted } MATIC</Text>
      }
    </Stack>
  );
};

export default WalletPage;