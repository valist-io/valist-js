import type { NextPage } from 'next';
import React from 'react';
import { Layout } from '@/components/Layout';
import { CreateAccount } from '@/components/CreateAccount';
import { Breadcrumbs } from '@valist/ui';

const Account: NextPage = () => {
  const breadcrumbs = [
    { title: 'Create Account', href: '/-/create/account' },
  ];

  return (
    <Layout>
      <div style={{ paddingBottom: 32 }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CreateAccount />
    </Layout>
  );
};

export default Account;