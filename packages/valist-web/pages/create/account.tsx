import type { NextPage } from 'next';
import Layout from '../../components/Layouts/Main';
import ManageTeam from '../../features/teams/ManageAccount';

const CreateAccountPage: NextPage = () => {
  return (
    <Layout title={`Valist | Create team`}>
      <ManageTeam />
    </Layout>
  );
};

export default CreateAccountPage;
