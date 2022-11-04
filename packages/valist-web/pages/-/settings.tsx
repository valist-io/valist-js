import { NextPage } from 'next';
import { Checkbox, useMantineColorScheme } from '@mantine/core';
import { Layout } from '@/components/Layout';
import { ArrowBack } from 'tabler-icons-react';
import { useRouter } from 'next/router';

const SettingsPage: NextPage = () => {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Layout>
      <ArrowBack 
        style={{ marginBottom: 10 }} 
        onClick={() => router.back()} 
        size={32}
      />
      <Checkbox
        label="Darkmode"
        color="indigo"
        size="sm"
        checked={colorScheme === 'dark'}
        onChange={() => toggleColorScheme()}
      />
    </Layout>
  );
};

export default SettingsPage;