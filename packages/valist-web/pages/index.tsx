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
import { License, Team } from '../utils/Valist/types';
import CreateButton from '../components/Homepage/CreateButton';
import LoginForm from '../components/Accounts/LoginForm';
import { truncate } from '../utils/Formatting/truncate';
import { normalizeUserProjects } from '../utils/Apollo/normalization';

const Dashboard: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);
  const [view, setView] = useState<string>('');
  const [userAccount, setUserAccount] = useState<string>('');
  const [userTeams, setUserTeams] = useState<Record<string, Project>>({});
  const [userTeamNames, setUserTeamNames] = useState<string[]>([]);
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [accountProjects, setAccountProjects] = useState<Record<string, Project[]>>({});
  const [userLicenses, setUserLicenses] = useState<License[]>([]);
  const { data, loading, error } = useQuery(USER_HOMEPAGE, {
    variables: { address: accountCtx.address.toLowerCase() },
  });
  const isTeams = (userTeamNames.length !== 0);
  const isProjects = (currentProjects.length !== 0);
  const isLicenses = (userLicenses.length !== 0);
  const initialActivity = [
    {
      id: '0x0',
      sender: truncate(accountCtx?.address, 10),
    },
  ];
  const transactionActions = ['Team'];
  if (isTeams) transactionActions.push('Project');
  if (isProjects) transactionActions.push('License');

  useEffect(() => {
    (async () => {
      if (currentProjects.length > 0) {
        let licenses:License[] = [];

        for (let i = 0; i < currentProjects.length; ++i) {
          const project = currentProjects[i];
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
      } else {
        setUserLicenses([]);
      };
    })();
  }, [currentProjects, currentProjects.length, valistCtx.contract]);

  // Set User's teams and the projects under them
  useEffect(() => {
    if (data?.users[0] && data?.users[0]?.teams) {
      const { teamNames, teams } = normalizeUserProjects(
        data.users[0].teams,
        data.users[0].projects,
      );

      setUserAccount(teamNames[0]);
      setAccountProjects(teams);
      setUserTeamNames(teamNames);
    } else {
      setUserTeamNames([]);
    }
  }, [data, loading, accountCtx?.address]);


  // If userAccount changes set projects under current account
  useEffect(() => {
    setCurrentProjects(accountProjects[userAccount] || []);
  }, [accountProjects, userAccount]);

  // Set homepageView
  useEffect(() => {
    if (!isTeams) {
      setView('EmptyTeams');
    } else if (currentProjects.length === 0) {
      setView('EmptyProjects');
    } else {
      setView('Projects');
    }
  },[data, currentProjects, userTeams, accountCtx.address, isTeams]);

  if (accountCtx?.address === '0x0' && accountCtx.loginTried) {
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
            accountNames={userTeamNames} 
            userAccount={userAccount}
            setUserAccount={setUserAccount}          
          />
          <HomepageContent 
            userProjects={currentProjects}
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
