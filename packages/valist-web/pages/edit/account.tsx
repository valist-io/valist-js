import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layouts/Main';
import EditTeam from '@/features/accounts/ManageAccount';

const EditAccountPage: NextPage = () => {
  const router = useRouter();
  let name = (router.query.name as string | undefined);

  return (
    <Layout title={`Valist | Create team`}>
      <EditTeam accountUsername={name} />
    </Layout>
  );
};

export default EditAccountPage;
