// /* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import Layout from '../components/Layouts/Main';
import { selectAccountNames, selectAccounts, selectAddress, selectCurrentAccount, selectLoginTried } from '../features/accounts/accountsSlice';
import LoginForm from '../features/accounts/LoginForm';
import CreateButton from '../features/dashboard/CreateButton';
import DashboardContent from '../features/dashboard/DashboardContent';
import HomepageProfileCard from '../features/dashboard/DashboardProfileCard';
import PublishButton from '../features/dashboard/PublishButton';
import LogCard from '../features/logs/LogCard';
import ValistContext from '../features/valist/ValistContext';
import { Project } from '../utils/Apollo/types';
import { truncate } from '../utils/Formatting/truncate';
import { License } from '../utils/Valist/types';

const Dashboard: NextPage = () => {
  const valistCtx = useContext(ValistContext);
  const address = useAppSelector(selectAddress);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const loginTried = useAppSelector(selectLoginTried);
  const accounts = useAppSelector(selectAccounts);
  const accountNames = useAppSelector(selectAccountNames);
  const [userAccount, setUserAccount] = useState<string>('');
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [userLicenses, setUserLicenses] = useState<License[]>([]);
  const [view, setView] = useState<string>('');
  const isTeams = (accountNames.length !== 0);
  const isProjects = (currentProjects.length !== 0);
  const isLicenses = (userLicenses.length !== 0);
  const transactionActions = ['Account'];
  if (isTeams) transactionActions.push('Project');
  if (isProjects) transactionActions.push('License');
  
  const initialActivity = [
    {
      id: '0x0',
      sender: truncate(address, 10),
    },
  ];

  // Set user account from accountNames or local storage
  useEffect(() => {
    if (accountNames.length !== 0) {
      setUserAccount(currentAccount || accountNames[0]);
    }
  }, [accountNames, currentAccount]);

  // If userAccount changes set projects under current account
  useEffect(() => {
    setCurrentProjects(accounts[userAccount] || []);
  }, [accounts, userAccount]);

  // Set homepageView
  useEffect(() => {
    if (!isTeams) {
      setView('EmptyTeams');
    } else if (currentProjects.length === 0) {
      setView('EmptyProjects');
    } else {
      setView('Projects');
    }
  },[currentProjects, address, isTeams]);

  useEffect(() => {
    (async () => {
      if (currentProjects.length > 0) {
        let licenses:License[] = [];

        for (let i = 0; i < currentProjects.length; ++i) {
          const project = currentProjects[i];
          let licenseNames: string[] = [];

          try {
            licenseNames = await valistCtx.getLicenseNames(
              project.account.name,
              project.name,
              0,
              100,
            );
          } catch (err) {
            console.log(err);
          }

          for (let j = 0; j < licenseNames.length; ++j) {
            const id = await valistCtx.getLicenseID(project.id, licenseNames[j]);
            licenses.push({
              id: id.toString(),
              image: '',
              name: licenseNames[j],
              team: project.account.name,
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
  }, [currentProjects, currentProjects.length, valistCtx]);

  if (address === '0x0' && loginTried) {
    return (
      <Layout title="Valist | Login">
        <div className="flex justify-center items-center">
          <div className="mt-40 m-auto bg-white border rounded-lg flex items-center flex-col max-w-lg">
            <LoginForm />
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
            isProjects={isProjects}
            isTeams={isTeams}
            isLicenses={isLicenses}
            view={view}
            accountNames={accountNames}
            userAccount={userAccount}
            setView={setView}
          />
          <DashboardContent 
            userProjects={currentProjects}
            userLicenses={userLicenses}
            address={address}
            view={view}
          />
        </div>
       {/* Right column */}
       <div className="grid grid-cols-1 gap-4">
          <div className='rounded-lg bg-white overflow-hidden shadow p-4 overflow-visible'>
            <div className='flex justify-center items-center'>
              <PublishButton account={currentAccount} disabled={isProjects} />
              <CreateButton transactions={transactionActions}/>
            </div>
          </div>
          <LogCard initialLogs={initialActivity} address={address} />
        </div>
      </div>}
    </Layout>
  );
};

export default Dashboard;