import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import { Group } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { List, Card } from '@valist/ui';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { AccountSelect } from '@/components/AccountSelect';
import { useDashboard } from '@/utils/dashboard';

const ActivityPage: NextPage = () => {
  const { address } = useAccount();
  const [accountName, setAccountName] = useState('');

  const { accounts, logs } = useDashboard(accountName);
  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  return (
    <Layout padding={0}>
      <Group mt={40} pl={40} position="apart">
        <AccountSelect 
          value={accountName}
          onChange={setAccountName}
        />
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