import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery,gql } from "@apollo/client";
import Layout from '../../components/Layouts/Main';
import { ACCOUNT_PROFILE_QUERY } from '@valist/sdk/dist/graphql';
import { Log, Project, Member } from '../../utils/Apollo/types';
import { AccountMeta } from '../../utils/Valist/types';
import LogTable from '../../features/logs/LogTable';
import LogCard from '../../features/logs/LogCard';
import TeamProfileCard from '../../features/accounts/AccountProfileCard';
import TeamProjectList from '../../features/accounts/AccountProjectList';
import TeamMemberList from '../../features/accounts/AccountMemberList';
import TeamProfileCardActions from '../../features/accounts/AccountProfileCardActions';
import { useAppSelector } from '../../app/hooks';
import { selectAccountNames } from '../../features/accounts/accountsSlice';

export default function AccountProfilePage() {
  const router = useRouter();
  const accountName = `${router.query.accountName}`;
  const { data, loading, error } = useQuery(gql(ACCOUNT_PROFILE_QUERY), {
    variables: { account: accountName },
  });

  const [view, setView] = useState<string>('Projects');
  const [meta, setMeta] = useState<AccountMeta>({
    image: '',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const accountNames = useAppSelector(selectAccountNames);
  const isMember = accountNames.includes(accountName);

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

  return (
    <Layout title='Valist | Team'>
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <TeamProfileCard
            view={view}
            setView={setView}
            accountName={accountName}
            accountImage={meta.image ? meta.image : ''}
            meta={meta}
            tabs={tabs}          
          />
          {view === 'Projects' && <TeamProjectList projects={projects} linksDisabled={false} />}
          {view === 'Activity' && <LogTable logs={logs} />}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {isMember && <TeamProfileCardActions accountName={accountName} />}
          <TeamMemberList
            accountMembers={members} 
            accountName={accountName}          
          />
          <LogCard logs={logs} />
        </div>
      </div> 
    </Layout>
  );
}