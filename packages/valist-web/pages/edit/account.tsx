import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layouts/Main';
import EditTeam from '../../features/teams/EditTeam';

const EditAccountPage: NextPage = () => {
  const router = useRouter();
  let { name } = router.query;
  if (Array.isArray(name)) {
    name = name.join('');
  }
  if (!name) {
    name = '';
  }

  return (
    <Layout title={`Valist | Create team`}>
      <EditTeam teamName={name} />
    </Layout>
  );
};

export default EditAccountPage;
