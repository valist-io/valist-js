import type { NextPage } from 'next';
import Layout from '../../components/Layouts/Main';
import ManageAccount from '@/features/accounts/ManageAccount';

const CreateAccountPage: NextPage = () => {
  return (
    <Layout title={`Valist | Create account`}>
      <ManageAccount />
    </Layout>
  );
};

export default CreateAccountPage;
