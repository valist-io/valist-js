import React, { useState, useEffect } from 'react';
import { gql } from "@apollo/client";
import Layout from '../../components/Layouts/Main';
import { ACCOUNT_PROFILE_QUERY } from '@valist/sdk/dist/graphql';
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
import client from '@/utils/Apollo/client';

type AccountMember = {
  id: string
}

export const getServerSideProps = async ({ params, res }: any) => {
  const { data } = await client.query({
    query: gql(ACCOUNT_PROFILE_QUERY),
    variables: { account: params.accountName },
  });

  let accountMeta;
  if (data && data.accounts && data.accounts[0] && data.accounts[0].metaURI) {
    try {
      accountMeta = await fetch(data.accounts[0].metaURI).then(res => res.json());
    } catch(err) { /* TODO HANDLE */ }
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=11',
  );

  return {
    props: {
      data,
      accountMeta,
      accountName: params.accountName,
    },
  };
};

export default function AccountProfilePage(props: any) {
  const accountNames = useAppSelector(selectAccountNames);
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
    setMeta(props.accountMeta);
    setaProjects(props.data.accounts[0].projects);
    setMembers(props.data.accounts[0].members);
    setLogs(props.data.accounts[0].logs);
  }, [props.accountMeta, props.data, setMeta]);

  useEffect(() => {
    if (props.accountName) {
      accountNames.map((name: string) => {
        if (props.accountName === name) setIsMember(true);
      });
    }
  }, [accountNames, props.accountName]);

  return (
    <Layout title='Valist | Team'>
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <TeamProfileCard
            view={view}
            setView={setView}
            accountName={props.accountName}
            accountImage={meta.image ? meta.image : ''}
            meta={meta}
            tabs={tabs}          
          />
          {view === 'Projects' && <TeamProjectList projects={projects} linksDisabled={false} />}
          {view === 'Activity' && <LogTable logs={logs} />}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {isMember && <TeamProfileCardActions accountName={props.accountName} />}
          <TeamMemberList
            accountMembers={members} 
            accountName={props.accountName}          
          />
          <LogCard logs={logs} />
        </div>
      </div> 
    </Layout>
  );
}