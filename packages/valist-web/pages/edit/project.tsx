import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layouts/Main';
import ManageProject from '../../features/projects/ManageProject';

const EditProjectPage: NextPage = () => {
  const router = useRouter();
  let { account, project } = router.query;
  if (Array.isArray(account)) account = account.join('');
  if (!account) account = '';
  if (Array.isArray(project)) project = project.join('');
  if (!project) project = '';

  return (
    <Layout title={`Valist | Edit Project`}>
      <ManageProject accountUsername={account} projectName={project} />
    </Layout>
  );
};

export default EditProjectPage;