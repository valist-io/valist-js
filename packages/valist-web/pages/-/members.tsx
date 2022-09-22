import { NextPage } from 'next';
import { useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { Group, SimpleGrid } from '@mantine/core';
import { Layout } from '@/components/Layout';
import { Activity } from '@/components/Activity';
import { Metadata } from '@/components/Metadata';
import { useMembers } from '@/utils/dashboard';


import {
  AccountSelect,
  MemberCard,
} from '@valist/ui';

const MembersPage: NextPage = () => {
  const [accountName, setAccountName] = useState('');
  const { accounts, members } = useMembers(accountName);

  const account: any = accounts.find((a: any) => a.name === accountName);
  const { data: accountMeta } = useSWRImmutable(account?.metaURI);

  const getAccounts = (member: any) => {
    const accountMap = new Map<string, any>();
    member.accounts.forEach((a: any) => accountMap.set(a.id, a));
    member.projects.forEach((p: any) => accountMap.set(p.account.id, p.account));
    return Array.from(accountMap.values());
  };

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
        <SimpleGrid 
          breakpoints={[
            { minWidth: 'sm', cols: 1, spacing: 24 },
            { minWidth: 'md', cols: 2, spacing: 24 },
            { minWidth: 'lg', cols: 3, spacing: 24 },
            { minWidth: 'xl', cols: 4, spacing: 24 },
          ]}
        >
          {members.map((member: any, index: number) => 
            <MemberCard 
              key={index} 
              address={member.id} 
              accounts={getAccounts(member)} 
            />,
          )}
        </SimpleGrid>
      </div>
    </Layout>
  );
};

export default MembersPage;