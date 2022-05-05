import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layouts/Main';
import ManageProject from '../../features/projects/ManageProject';

const EditProjectPage: NextPage = () => {
  const router = useRouter();
  let account = (router.query.account as string | undefined);
  let project = (router.query.project as string | undefined);

  return (
    <Layout title={`Valist | Edit Project`}>
      <ManageProject accountUsername={account} projectName={project} />
    </Layout>
  );
};

export default EditProjectPage;