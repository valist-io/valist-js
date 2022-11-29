import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import { Group } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { Metadata } from '@/components/Metadata';
import { useDashboard } from '@/utils/dashboard';

import {
  AccountSelect,
  List,
  Card,
} from '@valist/ui';

const ActivityPage: NextPage = () => {
  const { address } = useAccount();

  const [accountNames, setAccountNames] = useLocalStorage<Record<string, string>>({
    key: 'accountNames',
    defaultValue: {},
  });

  const setAccountName = (name: string) => setAccountNames(current => ({ ...current, [`${address}`]: name }));

  const accountName = address ? accountNames[address] : '';
  const { accounts, logs } = useDashboard(accountName);
  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <AccountSelect
          name={accountName || 'All Accounts'}
          value={accountName}
          image={accountMeta?.image}
          href="/-/create/account"
          onChange={setAccountName}
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