import { useEffect } from 'react';
import { AccountSelect as AccountSelectUI } from '@valist/ui';
import { useLocalStorage } from '@mantine/hooks';
import useSWRImmutable from 'swr/immutable';
import { useAccount } from 'wagmi';
import { Metadata } from '@/components/Metadata';
import { useAccounts } from '@/utils/dashboard';

export interface AccountSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export function AccountSelect(props: AccountSelectProps) {
  const { value, onChange } = props;

  const [accountNames, setAccountNames] = useLocalStorage<Record<string, string>>({
    key: 'accountNames',
    defaultValue: {},
  });

  const { address } = useAccount();
  const { accounts, loading } = useAccounts();

  const account: any = accounts.find((a: any) => a.name === value);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  // set the current account for the user
  useEffect(() => {
    // wait until loading is finished
    if (loading) return;

    // restore account selection from local storage
    const _accountName = address ? accountNames[address] : '';
    const _account: any = accounts.find((a: any) => a.name === _accountName);

    // if only one account exists default to it
    if (accounts.length === 1) {
      onChange(accounts[0].name);
    } else if (_account) {
      onChange(_accountName);
    }
  }, [address, accounts, accountNames, onChange, loading]);

  const setAccountName = (name: string) => {
    if (address) setAccountNames(current => ({ ...current, [address]: name }));
    onChange(name);
  };

  return (
    <AccountSelectUI
      name={value || 'All Accounts'}
      value={value || ''}
      image={accountMeta?.image}
      href="/-/create/account"
      onChange={setAccountName}
    >
      {accounts.length > 1 &&
        <AccountSelectUI.Option 
          value="" 
          name="All Accounts" 
        />
      }
      {accounts.map((acc: any, index: number) => 
        <Metadata key={index} url={acc.metaURI}>
          {(data: any) => ( 
            <AccountSelectUI.Option 
              value={acc.name}
              name={acc.name}
              image={data?.image}
            /> 
          )}
        </Metadata>,
      )}
    </AccountSelectUI>
  );
}