import type { NextPage } from 'next';
import React from 'react';
import { Layout } from '@/components/Layout';
import { CreateProject } from '@/components/CreateProject';
import { Breadcrumbs } from '@valist/ui';
import { useRouter } from 'next/router';

const Project: NextPage = () => {
  const router = useRouter();
  const accountName = `${router.query.account}`;

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: 'Create Project', href: '/-/create/account' },
  ];

  return (
    <Layout>
      <div style={{ paddingBottom: 32 }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CreateProject />
    </Layout>
  );
};

export default Project;