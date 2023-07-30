import { useQuery } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Account, Project } from '@valist/sdk/dist/graphql';
import { Layout } from '@/components/Layout';
import { CardGrid, ProjectCard, SearchOptions } from '@valist/ui';
import { Metadata } from '@/components/Metadata';
import query from '@/graphql/SearchPage.graphql';
import Link from 'next/link';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const search = `${router.query.query}`;
  const [ projects, setProjects ] = useState<Project[]>([]);
  const [ accounts, setAccounts ] = useState<Account[]>([]);
  const [ searchType, setSearchType ] = useState<'projects' | 'accounts'>('projects');;
  const [ order, setOrder ] = useState<string>('desc');
  const { data, loading, error } = useQuery(query, {
    variables: { search: search, order },
  });

  useEffect(() => {
    if (data && data.projects) setProjects(data.projects);
    if (data && data.accounts) setAccounts(data.accounts);
  }, [data, loading, error]);

  return (
    <Layout>
      <h1 style={{ fontSize: 24, margin: "0 0 20 0" }}>Search Results</h1>
      <SearchOptions 
        order={order}
        searchType={searchType} 
        projectCount={projects.length} 
        accountCount={accounts.length} 
        setSearchType={setSearchType} 
        setOrder={setOrder}
      />
      {projects && searchType === 'projects' &&
        <CardGrid>
          {projects.map((project: any, index: number) =>
              <Metadata key={index} url={project.metaURI}>
              {(data: any) =>
                <Link
                  style={{ textDecoration: 'none' }}
                  href={`/${project.account?.name}/${project.name}`}
                  passHref
                >
                  <ProjectCard
                    title={project.name} 
                    secondary={data?.name}
                    description={data?.description} 
                    image={data?.image} 
                  />
                </Link>
              }
            </Metadata>,
          )}
        </CardGrid>
      }

      {searchType === 'accounts' &&  
        <CardGrid>
          {accounts && accounts.map((account: any, index: number) =>
            <Metadata key={index} url={account.metaURI}>
              {(data: any) =>
                <Link
                  style={{ textDecoration: 'none' }}
                  href={`/${account?.name}`}
                  passHref
                >
                  <ProjectCard
                    title={account?.name} 
                    secondary={data?.name}
                    description={data?.description} 
                    image={data?.image} 
                  />
                </Link>
              }
            </Metadata>,
          )}
        </CardGrid>}
    </Layout>
  );
};

export default SearchPage;