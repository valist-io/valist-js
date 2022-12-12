import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import useSWRImmutable from 'swr/immutable';
import { Group, SimpleGrid } from '@mantine/core';
import { MemberCard } from '@valist/ui';
import { Layout } from '@/components/Layout';
import { AccountSelect } from '@/components/AccountSelect';
import { useMembers } from '@/utils/dashboard';

const MembersPage: NextPage = () => {
  const { address } = useAccount();
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
          value={accountName}
          onChange={setAccountName}
        />
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