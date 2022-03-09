import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import AccountContext from '../components/Accounts/AccountContext';
import LogCard from '../components/Logs/LogCard';
import HomepageProfileCard from '../components/Homepage/HomepageProfileCard';
import Layout from '../components/Layouts/Main';
import { USER_HOMEPAGE } from '../utils/Apollo/queries';
import { Project } from '../utils/Apollo/types';
import HomepageContent from '../components/Homepage/HomepageContent';
import Link from 'next/link';
import ValistContext from '../components/Valist/ValistContext';
import { License } from '../utils/Valist/types';
import CreateButton from '../components/Homepage/CreateButton';
import LoginForm from '../components/Accounts/LoginForm';
import { truncate } from '../utils/Formatting/truncate';

const Dashboard: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);
  const [view, setView] = useState<string>('');
  const [userTeams, setUserTeams] = useState<Project[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [userLicenses, setUserLicenses] = useState<License[]>([]);
  const { data, loading, error } = useQuery(USER_HOMEPAGE, {
    variables: { address: accountCtx.address.toLowerCase() },
  });
  const isTeams = (userTeams.length !== 0);
  const isProjects = (userProjects.length !== 0);
  const isLicenses = (userLicenses.length !== 0);
  const initialActivity = [
    {
      id: '0x0',
      sender: truncate(accountCtx?.address, 10),
    },
  ];
  const transactionActions = ['Team'];
  if (isTeams) transactionActions.push('Project');
  if (isProjects) transactionActions.push('Licenses');

  useEffect(() => {
    (async () => {
      if (userProjects.length > 0) {
        let licenses:License[] = [];

        for (let i = 0; i < userProjects.length; ++i) {
          const project = userProjects[i];
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
        
        setUserLicenses(licenses);
      };
    })();
  }, [userProjects, userProjects.length, valistCtx.contract]);

  useEffect(() => {
    if (data?.users[0] && data?.users[0]?.projects) {
      setUserProjects(data.users[0].projects);
    } else {
      setUserProjects([]);
    }

    if (data?.users[0] && data?.users[0]?.teams) {
      setUserTeams(data.users[0].teams);
    } else {
      setUserTeams([]);
    }
  }, [data, loading, setUserProjects, accountCtx?.address]);

  // Set homepageView
  useEffect(() => {
    if (userTeams.length === 0) {
      setView('EmptyTeams');
    } else if (userProjects.length === 0) {
      setView('EmptyProjects');
    } else {
      setView('Projects');
    }
  },[data, userProjects, userTeams, accountCtx.address]);

  if (accountCtx?.address === '0x0') {
    return (
      <Layout title="Valist | Login">
        <div className="flex justify-center items-center">
          <div className="mt-40 m-auto bg-white border rounded-lg flex items-center flex-col max-w-lg">
            <LoginForm
              setProvider={accountCtx.setProvider} 
              setAddress={accountCtx.setAddress} 
            />
          </div>
        </div>
      </Layout>
    );
  };

  return (
    <Layout title="Valist | Dashboard">
      {<div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <HomepageProfileCard 
            reverseEns={accountCtx?.reverseEns} 
            address={accountCtx?.address} 
            view={view} 
            setView={setView} 
            isProjects={isProjects} 
            isTeams={isTeams} 
            isLicenses={isLicenses} 
          />
          <HomepageContent 
            userProjects={userProjects}
            userTeams={userTeams} 
            userLicenses={userLicenses} 
            view={view} 
            address={accountCtx.address} />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          <div className='bg-white rounded-lg bg-white overflow-hidden shadow p-4 overflow-visible'>
            <div className='flex justify-center items-center'>
              <div className="flex content-end sm:mt-0">
                <Link href={isProjects ? "create?action=release" : "/"}>
                  <a className={`flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm font-medium text-white
            ${isProjects && !loading ?
              'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
              'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
            }`}>
                    Publish Release
                  </a>
                </Link>
              </div>
              
             <CreateButton transactions={transactionActions}/>
            </div>
          </div>
          <LogCard initialLogs={initialActivity} address={accountCtx.address} />
        </div>
      </div>}
    </Layout>
  );
};

export default Dashboard;
