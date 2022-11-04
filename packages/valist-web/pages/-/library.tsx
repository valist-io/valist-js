import { NextPage } from 'next';
import { Layout } from '@/components/Layout';
import { LibraryCard } from '@/components/LibraryCard';
import { useLibrary, useInstalls } from '@/utils/library';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { ProjectCard } from '@/components/ProjectCard';
import { useValist } from '@/utils/valist';
import query from '@/graphql/LibraryPage.graphql';

import { 
  SimpleGrid,
} from '@mantine/core';

const LibraryPage: NextPage = () => {
  const { releases } = useInstalls();
  const { projects } = useLibrary();
  const valist = useValist();
  const { address } = useAccount();

  const installed = (projectId: string) => {
    const release = releases.find((r: any) => r.project.id === projectId);
    return release?.id ?? '';
  };

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
            <LibraryCard 
              key={index}
              id={project.id}
              name={project.name}
              metaURI={project.metaURI}
              href={`/${project.account?.name}/${project.name}`}
              installed={installed(project.id)}
            />,
          )}
        </SimpleGrid>
      </div>
    </Layout>
  );
};

export default LibraryPage;