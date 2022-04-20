// /* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import Layout from '../components/Layouts/Main';
import { selectAccountNames, selectAccounts, selectAddress, selectCurrentAccount, selectLoginTried } from '../features/accounts/accountsSlice';
import LoginForm from '../features/accounts/LoginForm';
import CreateButton from '../features/dashboard/CreateButton';
import DashboardContent from '../features/dashboard/DashboardContent';
import HomepageProfileCard from '../features/dashboard/DashboardProfileCard';
import PublishButton from '../features/dashboard/PublishButton';
import LogCard from '../features/logs/LogCard';
import { USER_LOGS_QUERY } from '../utils/Apollo/queries';
import { Log, Project } from '../utils/Apollo/types';
import { truncate } from '../utils/Formatting/truncate';

const Dashboard: NextPage = () => {
  const address = useAppSelector(selectAddress);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const loginTried = useAppSelector(selectLoginTried);
  const accounts = useAppSelector(selectAccounts);
  const accountNames = useAppSelector(selectAccountNames);
  const { data, loading, error } = useQuery(USER_LOGS_QUERY, {
    variables: { address: address.toLowerCase() },
  });
  const [logs, setLogs] = useState<Log[]>([]);
  const [userAccount, setUserAccount] = useState<string>('');
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [view, setView] = useState<string>('');
  const isAccounts = (accountNames.length !== 0);
  const isProjects = (currentProjects.length !== 0);
  const transactionActions = ['Account'];
  if (isAccounts) transactionActions.push('Project');
  
  const initialActivity = [
    {
      id: '0x0',
      type: 'Connected',
      sender: truncate(address, 10),
    },
  ];

  useEffect(() => {
    if (data?.logs) setLogs(data.logs);
  }, [data]);

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
    if (!isAccounts) {
      setView('EmptyTeams');
    } else if (currentProjects.length === 0) {
      setView('EmptyProjects');
    } else {
      setView('Projects');
    }
  },[currentProjects, address, isAccounts]);

  console.log('logs', logs, data);

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
            isAccounts={isAccounts}
            view={view}
            accountNames={accountNames}
            userAccount={userAccount}
            setView={setView}
          />
          <DashboardContent 
            userProjects={currentProjects}
            logs={logs}
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
          <LogCard logs={logs.length !== 0 ? logs : initialActivity} address={address} />
        </div>
      </div>}
    </Layout>
  );
};

export default Dashboard;