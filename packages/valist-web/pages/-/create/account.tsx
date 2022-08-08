import type { NextPage } from 'next';
import React from 'react';
import { Layout } from '@/components/Layout';
import { CreateAccount } from '@/components/CreateAccount';
import { useRouter } from 'next/router';

const Account: NextPage = () => {
  const router = useRouter();
  return (
    <Layout
      breadcrumbs={[
        { title: 'Create Account', href: '/-/create/account' },
      ]}
    >
      <CreateAccount 
        afterCreate={() => {
          router.push('/');  
        }}
      />
    </Layout>
  );
};

export default Account;