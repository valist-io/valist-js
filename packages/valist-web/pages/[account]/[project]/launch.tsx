import type { NextPage } from 'next';
import { useContext, useEffect } from 'react';
import { useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import useSWRImmutable from 'swr/immutable';
import { useQuery } from '@apollo/client';
import { Breadcrumbs } from '@valist/ui';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import query from '@/graphql/ProjectPage.graphql';

import {
  Loader,
  Center,
} from '@mantine/core';

const ProjectPage: NextPage = () => {
  const { chain } = useNetwork();

  const router = useRouter();
  const valist = useContext(ValistContext);

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id || 137, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, {
    variables: { projectId },
  });

  const latestRelease = data?.project?.releases?.[0];

  const { data: releaseMeta } = useSWRImmutable(latestRelease?.metaURI);

  useEffect(() => {
    if (releaseMeta) {
      window.location.href = releaseMeta.external_url;
    }
  }, [releaseMeta]);

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
  ];

  return (
    <Layout>
      <Breadcrumbs items={breadcrumbs} />
      <Center mt={150}>
        <Loader size={100} />
      </Center>
    </Layout>
  );
};

export default ProjectPage;