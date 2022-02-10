import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import AccountContext from '../components/Accounts/AccountContext';
import ActivityCard from '../components/Logs/ActivityCard';
import HomepageLinks from '../components/Homepage/HomepageLinks';
import HomepageProfileCard from '../components/Homepage/HomepageProfileCard';
import Layout from '../components/Layouts/Main';
import ProjectList from '../components/Projects/ProjectList';
import { USER_PROJECTS } from '../utils/Apollo/queries';
import { Project } from '../utils/Apollo/types';

const Dashboard: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  const [view, setView] = useState<string>("Projects");
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const { data, loading, error } = useQuery(USER_PROJECTS, {
    variables: { address: accountCtx.address.toLowerCase() },
  });
  const router = useRouter();

  useEffect(() => {
    if (data?.users[0] && data?.users[0]?.projects) {
      setUserProjects(data.users[0].projects);
    } else if (data && (accountCtx?.address.length > 3)) {
        router.push('/create?action=team');    
    }
  }, [data, loading, error, setUserProjects]);

  return (
    <Layout title="Valist | Dashboard">
      {<div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <HomepageProfileCard address={accountCtx.address} view={view} setView={setView} />
          <ProjectList linksDisabled={false} projects={userProjects}/>
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          <HomepageLinks />
          <ActivityCard logType={'sender'} address={accountCtx.address} />
        </div>
      </div>}
    </Layout>
  );
};

export default Dashboard;
