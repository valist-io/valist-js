import { 
  selectCurrentAccount,
  selectAccountNames, 
} from '@/features/accounts/accountsSlice';

import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import type { NextPage } from 'next';
import { useAppSelector } from '../app/hooks';
import Layout from '@/components/Layouts/Main';
import EmptyAccounts from '@/features/accounts/EmptyAccounts';
import { Log, Project, Member } from '@/utils/Apollo/types';
import { AccountMeta } from '@/utils/Valist/types';
import { ACCOUNT_PROFILE_QUERY } from '@valist/sdk/dist/graphql';

import LogTable from '@/features/logs/LogTable';
import LogCard from '@/features/logs/LogCard';
import TeamProfileCard from '@/features/accounts/AccountProfileCard';
import TeamProjectList from '@/features/accounts/AccountProjectList';
import TeamMemberList from '@/features/accounts/AccountMemberList';
import TeamProfileCardActions from '@/features/accounts/AccountProfileCardActions';

const Dashboard: NextPage = () => {
  const currentAccount = useAppSelector(selectCurrentAccount);
  const [view, setView] = useState<string>('Projects');
  const [meta, setMeta] = useState<AccountMeta>({
    image: '',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const { data, loading, error } = useQuery(gql(ACCOUNT_PROFILE_QUERY), {
    variables: { account: currentAccount },
  });

  useEffect(() => {
    if (data && data.accounts && data.accounts[0] && data.accounts[0].metaURI) {
      fetch(data.accounts[0].metaURI)
        .then(res => res.json())
        .then(setMeta);
      setProjects(data.accounts[0].projects);
      setMembers(data.accounts[0].members);
      setLogs(data.accounts[0].logs);
    }
  }, [data, loading, error, setMeta]);

  const tabs = [
    {
      text: 'Projects',
      disabled: false,
    },
    {
      text: 'Activity',
      disabled: false,
    },
  ];

  if (currentAccount === '') {
    return (
      <Layout title="Valist | Dashboard">
        <EmptyAccounts />
      </Layout>
    );
  }

  return (
    <Layout title="Valist | Dashboard">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <TeamProfileCard
            view={view}
            setView={setView}
            accountName={currentAccount}
            accountImage={meta.image ? meta.image : ''}
            meta={meta}
            tabs={tabs}          
          />
          {view === 'Projects' && <TeamProjectList projects={projects} linksDisabled={false} />}
          {view === 'Activity' && <LogTable logs={logs} />}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <TeamProfileCardActions accountName={currentAccount} />
          <TeamMemberList
            accountMembers={members} 
            accountName={currentAccount}          
          />
          <LogCard logs={logs} />
        </div>
      </div> 
    </Layout>
  );
};

export default Dashboard;