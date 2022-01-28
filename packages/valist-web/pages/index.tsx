import type { NextPage } from 'next';
import { useContext, useState } from 'react';
import AccountContext from '../components/Accounts/AccountContext';
import HomepageActivity from '../components/Homepage/HomepageActivity';
import HomepageLinks from '../components/Homepage/HomepageLinks';
import HomepageProfileCard from '../components/Homepage/HomepageProfileCard';
import Layout from '../components/Layouts/Main';
import ProjectList from '../components/Projects/ProjectList';

const Home: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  const [view, setView] = useState<string>("Projects");

  return (
    <Layout title="Valist | Dashboard">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <HomepageProfileCard address={accountCtx.address} view={view} setView={setView} />
          <ProjectList />
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4">
          <HomepageLinks />
          <HomepageActivity address={accountCtx.address} />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
