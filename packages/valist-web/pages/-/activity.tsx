import { NextPage } from 'next';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { Metadata } from '@/components/Metadata';
import query from '@/graphql/DashboardPage.graphql';

import { 
  Group,
  Timeline,
} from '@mantine/core';

import {
  AccountSelect,
  List,
  Card,
} from '@valist/ui';

const ActivityPage: NextPage = () => {
  const { address } = useAccount();

  const { data } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const accounts = Array.from((data?.user?.projects ?? [])
    .map((p: any) => p.account)
    .concat(data?.user?.accounts ?? [])
    .reduce((s: Map<string, any>, a: any) => s.set(a.id, a), new Map<string, any>())
    .values());

  const [accountName, setAccountName] = useState('');
  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  const projects = Array.from((data?.user?.accounts ?? [])
    .flatMap((a: any) => a.projects)
    .concat(data?.user?.projects ?? [])
    .filter((p: any) => accountName === '' || p.account.name === accountName)
    .reduce((s: Map<string, any>, p: any) => s.set(p.id, p), new Map<string, any>())
    .values());

  const logs = Array.from((account?.logs ?? accounts.flatMap((a: any) => a.logs))
    .concat(projects.flatMap((p: any) => p.logs))
    .sort((a: any, b: any) => b.blockTime.localeCompare(a.blockTime))
    .reduce((s: Map<string, any>, l: any) => s.set(l.id, l), new Map<string, any>())
    .values());

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