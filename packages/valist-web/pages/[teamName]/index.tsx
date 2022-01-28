import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from "@apollo/client";
import Layout from '../../components/Layouts/Main';
import TeamProfileCard from '../../components/Teams/TeamProfileCard';
import TeamMemberList from '../../components/Teams/TeamMemberList';
import TeamProjectList from '../../components/Teams/TeamProjectList';
import { TEAM_PROFILE_QUERY } from '../../utils/Apollo/queries';

interface TeamPageProps {
  address: string,
}

type TeamMember = {
  address: string
}

export default function Dashboard(props: TeamPageProps) {
  const router = useRouter();
  const teamName = `${router.query.teamName}`;
  const { data, loading, error } = useQuery(TEAM_PROFILE_QUERY, {
    variables: { team: teamName },
  });
  const [view, setView] = useState<string>('Projects');
  const [metaCID, setMetaCID] = useState<string>('');
  const [projects, setaProjects] = useState<any>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (data && data.teams) {
      setMetaCID(data.teams[0].metaURI);
      setaProjects(data.teams[0].projects);
      setMembers(data.teams[0].members);
    }
  }, [data, loading, error]);

  return (
    <Layout title='Valist | Team'>
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <TeamProfileCard 
            view={view} 
            setView={setView} 
            teamName={teamName}
            metaCID={metaCID}        
          />
          <TeamProjectList 
            projects={projects} 
            teamName={teamName}          
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <TeamMemberList 
            teamMembers={members} 
            teamName={teamName}          
          />
        </div>
      </div> 
    </Layout>
  );
}
