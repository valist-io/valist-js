import { NextPage } from 'next';
import { useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { ValistContext } from '@/components/ValistProvider';
import query from '@/graphql/LibraryPage.graphql';

import { 
  SimpleGrid,
} from '@mantine/core';

const LibraryPage: NextPage = () => {
  const valist = useContext(ValistContext);
  const { address } = useAccount();

  const { data, loading } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const _projects = Array.from((data?.purchases ?? [])
    .map(p => p.product?.project)
    .reduce((s, p) => s.set(p.id, p), new Map())
    .values());

  const [projects, setProjects] = useState([]);
  // update balances and filter projects
  useEffect(() => {
    if (_projects.length > 0) {
      const addresses = _projects.map(_ => address);
      const projectIDs = _projects.map(p => p.id);

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
            />
          )}
        </SimpleGrid>
      </div>
    </Layout>
  );
};

export default LibraryPage;