import type { NextPage } from 'next';
import React from 'react';
import { Layout } from '@/components/Layout';
import CreateProject from '@/components/CreateProject/CreateProject';

const Project: NextPage = () => {
  return (
    <Layout>
      <CreateProject />
    </Layout>
  );
};

export default Project;