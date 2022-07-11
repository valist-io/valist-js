import type { NextPage } from 'next';
import { Layout } from '@/components/Layout';
import { CreateAccountForm } from '@/components/CreateAccountForm';

const Account: NextPage = () => {
  return (
    <Layout>
      <CreateAccountForm />
    </Layout>
  );
};

export default Account;