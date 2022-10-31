import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { useValist } from '@/utils/valist';
import query from '@/graphql/LibraryPage.graphql';

import { 
  SimpleGrid,
} from '@mantine/core';

const LibraryPage: NextPage = () => {
  const valist = useValist();
  const { address } = useAccount();

  const { data, loading } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const _projects: any[] = Array.from((data?.purchases ?? [])
    .map((p: any) => p.product?.project)
    .reduce((s: Map<string, any>, p: any) => s.set(p.id, p), new Map<string, any>())
    .values());

  const [projects, setProjects] = useState<any[]>([]);
  // update balances and filter projects
  useEffect(() => {
    if (_projects.length > 0) {
      const addresses = _projects.map(_ => address ?? '');
      const projectIDs = _projects.map((p: any) => p.id);

      valist.getProductBalanceBatch(addresses, projectIDs).then(values => {
        const balances = values.map(v => v.toNumber());
        setProjects(_projects.filter((_, index) => balances[index] > 0));
      });
    }
  }, [data, loading]);

  return (
    <Layout padding={0}>
      <div style={{ padding: 40 }}>
        <SimpleGrid
          breakpoints={[
            { minWidth: 'sm', cols: 1, spacing: 24 },
            { minWidth: 'md', cols: 2, spacing: 24 },
            { minWidth: 'lg', cols: 3, spacing: 24 },
          ]}
        >
          { projects.map((project: any, index: number) =>
            <ProjectCard 
              key={index}
              name={project.name}
              metaURI={project.metaURI}
              href={`/${project.account?.name}/${project.name}`}
            />,
          )}
        </SimpleGrid>
      </div>
    </Layout>
  );
};

export default LibraryPage;