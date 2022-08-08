import type { NextPage } from 'next';
import React from 'react';
import { Layout } from '@/components/Layout';
import { CreateProject } from '@/components/CreateProject';
import { useRouter } from 'next/router';

const Project: NextPage = () => {
  const router = useRouter();
  const accountName = `${router.query.account}`;

  return (
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
        { title: 'Create Project', href: '/-/create/account' },
      ]}
    >
      <CreateProject />
    </Layout>
  );
};

export default Project;