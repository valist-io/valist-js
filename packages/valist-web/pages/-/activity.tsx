import { NextPage } from 'next';
import { useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import { Group } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { List, Card } from '@valist/ui';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { AccountContext } from '@/components/AccountProvider';
import { useDashboard } from '@/utils/dashboard';

const ActivityPage: NextPage = () => {
  const { address } = useAccount();
  const { account: accountName } = useContext(AccountContext);

  const { accounts, logs } = useDashboard(accountName);
  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  return (
    <Layout padding={0}>
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