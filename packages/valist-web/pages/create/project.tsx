import type { NextPage } from 'next';
import Layout from '../../components/Layouts/Main';
import ManageProject from '../../features/projects/ManageProject';

const CreateProjectPage: NextPage = () => {
  return (
    <Layout title={`Valist | Create Project`}>
      <ManageProject />
    </Layout>
  );
};

export default CreateProjectPage;