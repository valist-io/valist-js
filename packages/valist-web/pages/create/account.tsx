import type { NextPage } from 'next';
import Layout from '../../components/Layouts/Main';
import EditTeam from '../../features/teams/EditTeam';

const CreateAccountPage: NextPage = () => {
  return (
    <Layout title={`Valist | Create team`}>
      <EditTeam />
    </Layout>
  );
};

export default CreateAccountPage;
