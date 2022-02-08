import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from "@apollo/client";
import Layout from '../../components/Layouts/Main';
import TeamProfileCard from '../../components/Teams/TeamProfileCard';
import TeamMemberList from '../../components/Teams/TeamMemberList';
import TeamProjectList from '../../components/Teams/TeamProjectList';
import { TEAM_PROFILE_QUERY } from '../../utils/Apollo/queries';
import { Project } from '../../utils/Apollo/types';
import { TeamMeta } from '../../utils/Valist/types';
import ValistContext from '../../components/Valist/ValistContext';
import LogCard from '../../components/Logs/LogCard';
import LogTable from '../../components/Logs/LogTable';

type TeamMember = {
  id: string
}

export default function TeamProfilePage() {
  const router = useRouter();
  const teamName = `${router.query.teamName}`;
  const valistCtx = useContext(ValistContext);
  const { data, loading, error } = useQuery(TEAM_PROFILE_QUERY, {
    variables: { team: teamName },
  });
  const [view, setView] = useState<string>('Projects');
  const [meta, setMeta] = useState<TeamMeta>({
    image: '',
  });
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [projects, setaProjects] = useState<Project[]>([]);

  const fetchMeta = async (metaURI: string) => {
    try {
      const teamMeta = await valistCtx.valist.storage.readTeamMeta(metaURI);
      setMeta(teamMeta);
    } catch(err) { /* TODO HANDLE */ }
  }

  useEffect(() => {
    if (data && data.teams && data.teams[0] && data.teams[0].metaURI) {
      fetchMeta(data.teams[0].metaURI);
      setaProjects(data.teams[0].projects);
      setMembers(data.teams[0].members);
    }
  }, [data, loading, error, setMeta]);

  return (
    <Layout title='Valist | Team'>
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <TeamProfileCard 
            view={view} 
            setView={setView} 
            teamName={teamName}
            teamImage={meta.image || '/ipfs/QmfPeC65TKPbA3dxE314Boh82LX5NpkcrPXonCxUuKh6vr' }
            meta={meta}        
          />
          {view === 'Projects' && <TeamProjectList projects={projects} />}
          {view === 'Logs' && <LogTable team={teamName} />}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
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
