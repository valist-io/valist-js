// /* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, gql } from '@apollo/client';
import { Grid, Paper } from '@mantine/core';
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
import { USER_LOGS_QUERY } from '@valist/sdk/dist/graphql';
import { Log, Project } from '../utils/Apollo/types';
import { truncate } from '../utils/Formatting/truncate';

const Dashboard: NextPage = () => {
  const address = useAppSelector(selectAddress);
  const currentAccount = useAppSelector(selectCurrentAccount);
  const loginTried = useAppSelector(selectLoginTried);
  const accounts = useAppSelector(selectAccounts);
  const accountNames = useAppSelector(selectAccountNames);
  const { data, loading, error } = useQuery(gql(USER_LOGS_QUERY), {
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
      <Grid gutter="xl">
        {/* Left column */}
        <Grid.Col xs={12} lg={8}>
          <HomepageProfileCard
            isProjects={isProjects}
            isAccounts={isAccounts}
            view={view}
            accountNames={accountNames}
            userAccount={userAccount}
            setView={setView}
          />
          <DashboardContent
            accountName={currentAccount} 
            userProjects={currentProjects}
            logs={logs}
            address={address}
            view={view}
          />
        </Grid.Col>
        {/* Right column */}
        <Grid.Col xs={12} lg={4}>
          <Paper style={{ marginBottom: 15 }} shadow="xs" p="xl" radius={"md"} withBorder>
            <div className='grid grid-cols-2 gap-4'>
              <PublishButton account={currentAccount} disabled={isProjects} />
              <CreateButton accountName={currentAccount} transactions={transactionActions}/>
            </div>
          </Paper>
          <LogCard logs={logs.length !== 0 ? logs : initialActivity} />
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default Dashboard;