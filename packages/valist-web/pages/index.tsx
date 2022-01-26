import type { NextPage } from 'next';
import { useContext } from 'react';
import AccountContext from '../components/Accounts/AccountContext';
import Layout from '../components/Layouts/Main';

const Home: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  
  return (
    <Layout address={accountCtx.address}>
    </Layout>
  );
};

export default Home;
