import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from "@apollo/client";
import Layout from '../../components/Layouts/Main';
import { ACCOUNT_PROFILE_QUERY } from '../../utils/Apollo/queries';
import { Log, Project } from '../../utils/Apollo/types';
import { AccountMeta } from '../../utils/Valist/types';
import LogTable from '../../features/logs/LogTable';
import LogCard from '../../features/logs/LogCard';
import TeamProfileCard from '../../features/accounts/AccountProfileCard';
import TeamProjectList from '../../features/accounts/AccountProjectList';
import TeamMemberList from '../../features/accounts/AccountMemberList';
import TeamProfileCardActions from '../../features/accounts/AccountProfileCardActions';
import { useAppSelector } from '../../app/hooks';
import { selectAccountNames } from '../../features/accounts/accountsSlice';

type AccountMember = {
  id: string
}

export default function TeamProfilePage() {
  const router = useRouter();
  const accountName = `${router.query.accountName}`;
  const accountNames = useAppSelector(selectAccountNames);
  const { data, loading, error } = useQuery(ACCOUNT_PROFILE_QUERY, {
    variables: { account: accountName },
  });

  console.log("account profile data", data);

  const [view, setView] = useState<string>('Projects');
  const [meta, setMeta] = useState<AccountMeta>({
    image: '',
  });
  const [members, setMembers] = useState<AccountMember[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [projects, setaProjects] = useState<Project[]>([]);
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
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const fetchMeta = async (metaURI: string) => {
      try {
        const accountMeta = await fetch(metaURI).then(res => res.json());
        setMeta(accountMeta);
      } catch(err) { /* TODO HANDLE */ }
    };

    if (data && data.accounts && data.accounts[0] && data.accounts[0].metaURI) {
      fetchMeta(data.accounts[0].metaURI);
      setaProjects(data.accounts[0].projects);
      setMembers(data.accounts[0].members);
      setLogs(data.accounts[0].logs);
    }
  }, [data, loading, error, setMeta]);

  useEffect(() => {
    if (accountName) {
      accountNames.map((name) => {
        if (accountName === name) setIsMember(true);
      });
    }
  }, [accountNames, accountName]);

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