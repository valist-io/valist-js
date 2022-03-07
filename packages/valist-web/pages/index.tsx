import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import AccountContext from '../components/Accounts/AccountContext';
import LogCard from '../components/Logs/LogCard';
import HomepageLinks from '../components/Homepage/HomepageLinks';
import HomepageProfileCard from '../components/Homepage/HomepageProfileCard';
import Layout from '../components/Layouts/Main';
import { USER_PROJECTS } from '../utils/Apollo/queries';
import { Project } from '../utils/Apollo/types';
import HomepageContent from '../components/Homepage/HomepageContent';
import Link from 'next/link';
import ValistContext from '../components/Valist/ValistContext';
import { License } from '../utils/Valist/types';
import CreateButton from '../components/Homepage/CreateButton';

const Dashboard: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);
  const [view, setView] = useState<string>("Projects");
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userTeams, setUserTeams] = useState<Project[]>([]);
  const { data, loading, error } = useQuery(USER_PROJECTS, {
    variables: { address: accountCtx.address.toLowerCase() },
  });
  const router = useRouter();
  const [userlicenses, setUserLicences] = useState<License[]>([]);

  useEffect(() => {
    (async () => {
      if (userProjects.length > 0) {
        let licenses:License[] = [];

        for (let i = 0; i < userProjects.length; ++i) {
          const project = userProjects[i];
          console.log('project', project.team.name, project.name);
          let licenseNames: string[] = [];

          try {
            licenseNames = await valistCtx.contract.getLicenseNames(
              project.team.name,
              project.name,
              0,
              100,
            );
          } catch (err) {
            console.log(err);
          }

          for (let j = 0; j < licenseNames.length; ++j) {
            const id = await valistCtx.contract.getLicenseID(project.id, licenseNames[j]);
            licenses.push({
              id: id.toString(),
              image: '',
              name: licenseNames[j],
              team: project.team.name,
              project: project.name,
              description: '',
            });
          }
        }
        
        setUserLicences(licenses);
      };
    })();
  }, [userProjects, userProjects.length, valistCtx.contract]);

  useEffect(() => {
    if (data?.users[0] && data?.users[0]?.projects) {
      setUserProjects(data.users[0].projects);
    } else if (!loading && accountCtx?.address.length < 5) {
      router.push('/create?action=team');   
    }

    if (data?.users[0] && data?.users[0]?.teams) {
      setUserTeams(data.users[0].teams);
    }
  }, [data, loading, error, setUserProjects, accountCtx?.address.length, router]);

  console.log('userData', userTeams);

  return (
    <Layout title="Valist | Dashboard">
      {<div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <HomepageProfileCard reverseEns={accountCtx?.reverseEns} address={accountCtx.address} view={view} setView={setView} />
          <HomepageContent 
            userProjects={userProjects}
            userTeams={userTeams} 
            userLicenses={userlicenses} 
            view={view} 
            address={accountCtx.address} />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          <div className='bg-white rounded-lg bg-white overflow-hidden shadow p-4 overflow-visible'>
            <div className='flex justify-center items-center'>
              <div className="flex content-end sm:mt-0">
                <Link href="create?action=release">
                  <a className="flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Publish Release
                  </a>
                </Link>
              </div>
              
             <CreateButton />
            </div>
          </div>
          <HomepageLinks />
          <LogCard address={accountCtx.address} />
        </div>
      </div>}
    </Layout>
  );
};

export default Dashboard;
