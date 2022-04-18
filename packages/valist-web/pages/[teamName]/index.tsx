import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from "@apollo/client";
import Layout from '../../components/Layouts/Main';
import { TEAM_PROFILE_QUERY } from '../../utils/Apollo/queries';
import { Project } from '../../utils/Apollo/types';
import { TeamMeta } from '../../utils/Valist/types';
import LogTable from '../../features/logs/LogTable';
import LogCard from '../../features/logs/LogCard';
import TeamProfileCard from '../../features/teams/TeamProfileCard';
import TeamProjectList from '../../features/teams/TeamProjectList';
import TeamMemberList from '../../features/teams/TeamMemberList';
import TeamProfileCardActions from '../../features/teams/TeamProfileCardActions';
import { useAppSelector } from '../../app/hooks';
import { selectAccountNames } from '../../features/accounts/accountsSlice';

type TeamMember = {
  id: string
}

export default function TeamProfilePage() {
  const router = useRouter();
  const teamName = `${router.query.teamName}`;
  const accountNames = useAppSelector(selectAccountNames);
  const { data, loading, error } = useQuery(TEAM_PROFILE_QUERY, {
    variables: { team: teamName },
  });
  const [view, setView] = useState<string>('Projects');
  const [meta, setMeta] = useState<TeamMeta>({
    image: '',
  });
  const [members, setMembers] = useState<TeamMember[]>([]);
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
        const teamMeta = await fetch(metaURI).then(res => res.json());
        setMeta(teamMeta);
      } catch(err) { /* TODO HANDLE */ }
    };

    if (data && data.teams && data.teams[0] && data.teams[0].metaURI) {
      fetchMeta(data.teams[0].metaURI);
      setaProjects(data.teams[0].projects);
      setMembers(data.teams[0].members);
    }
  }, [data, loading, error, setMeta]);

  useEffect(() => {
    if (teamName) {
      accountNames.map((name) => {
        if (teamName === name) setIsMember(true);
      });
    }
  }, [accountNames, teamName]);

  return (
    <Layout title='Valist | Team'>
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <TeamProfileCard
            view={view}
            setView={setView}
            teamName={teamName}
            teamImage={meta.image ? meta.image : ''}
            meta={meta}
            tabs={tabs}          
          />
          {view === 'Projects' && <TeamProjectList projects={projects} linksDisabled={false} />}
          {view === 'Activity' && <LogTable team={teamName} project={''} address={''} />}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {isMember && <TeamProfileCardActions accountName={teamName} />}
          <TeamMemberList 
            teamMembers={members} 
            teamName={teamName}          
          />
          <LogCard team={teamName} />
        </div>
      </div> 
    </Layout>
  );
}
