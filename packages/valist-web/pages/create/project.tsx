import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layouts/Main';
import ManageProject from '../../features/projects/ManageProject';

const CreateProjectPage: NextPage = () => {
  const router = useRouter();
  let { account } = router.query;
  if (Array.isArray(account)) account = account.join('');
  if (!account) account = '';

  return (
    <Layout title={`Valist | Create Project`}>
      <ManageProject accountUsername={account} />
    </Layout>
  );
};

export default CreateProjectPage;