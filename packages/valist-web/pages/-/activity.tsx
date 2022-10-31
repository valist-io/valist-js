import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { Group } from '@mantine/core';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { Metadata } from '@/components/Metadata';
import { useDashboard } from '@/utils/dashboard';

import {
  AccountSelect,
  List,
  Card,
} from '@valist/ui';
import { useAccount } from 'wagmi';
import { getAccounts, setAccount } from '@valist/ui/dist/components/AccountSelect';

const ActivityPage: NextPage = () => {
  const { address } = useAccount();
  const [accountName, setAccountName] = useState('');
  const { accounts, logs } = useDashboard(accountName);
  
  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  const handleAccountChange = (name: string) => {
    const accountByAddress = getAccounts();
    if (address) setAccount(name, address, accountByAddress);
    setAccountName(name);
  };

  useEffect(() => {
    const accountByAddress = getAccounts();
    if (address) setAccountName(accountByAddress[address]);
  }, [address]);

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <AccountSelect
          name={accountName || 'All Accounts'}
          value={accountName}
          image={accountMeta?.image}
          href="/-/create/account"
          onChange={handleAccountChange}
        >
          <AccountSelect.Option value="" name="All Accounts" />
            {accounts.map((acc: any, index: number) => 
              <Metadata key={index} url={acc.metaURI}>
                {(data: any) => (
                  <AccountSelect.Option value={acc.name} name={acc.name} image={data?.image} />
                )}
              </Metadata>,
            )}
          </AccountSelect>
      </Group>
      <div style={{ padding: 40 }}>
        <Card>
          <List>
            {logs.map((log: any, index: number) => 
              <Activity key={index} {...log} />,
            )}
          </List>
        </Card>
      </div>
    </Layout>
  );
};

export default ActivityPage;