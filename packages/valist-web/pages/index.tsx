import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import AccountContext from '../components/Accounts/AccountContext';
import ActivityCard from '../components/Logs/ActivityCard';
import HomepageLinks from '../components/Homepage/HomepageLinks';
import HomepageProfileCard from '../components/Homepage/HomepageProfileCard';
import Layout from '../components/Layouts/Main';
import { USER_PROJECTS } from '../utils/Apollo/queries';
import { Project } from '../utils/Apollo/types';
import HomepageContent from '../components/Homepage/HomepageContent';
import Link from 'next/link';

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
          <HomepageContent userProjects={userProjects} view={view} />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          <div className='bg-white rounded-lg bg-white overflow-hidden shadow p-4'>
            <h2 className="text-base font-medium text-gray-900">Publishing</h2>
            <div className='flex mt-3'>
              <div className="mr-2 flex content-end sm:mt-0">
                <Link href="create?action=release">
                  <a className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Publish Release
                  </a>
                </Link>
              </div>

              <div className="mr-2 flex">
                <Link href="create?action=license">
                  <a className="flex justify-center items-center px-4 py-2 border
                  border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Create License
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <HomepageLinks />
          <ActivityCard logType={'sender'} address={accountCtx.address} />
        </div>
      </div>}
    </Layout>
  );
};

export default Dashboard;
