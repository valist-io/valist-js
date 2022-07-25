import { useQuery, gql } from '@apollo/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import { Account, Project } from '@valist/sdk/dist/graphql';
import { Badge, Card, Divider, Grid, List, Select, useMantineTheme } from '@mantine/core';
import { Layout } from '@/components/Layout';
import { ProjectCard } from '@valist/ui';
import { Metadata } from '@/components/Metadata';
import { NextLink } from '@mantine/next';
import query from '@/graphql/SearchPage.graphql';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const search = `${router.query.query}`;
  const theme = useMantineTheme();
  const [ projects, setProjects ] = useState<Project[]>([]);
  const [ accounts, setAccounts ] = useState<Account[]>([]);
  const [ searchType, setSearchType ] = useState<string>('projects');;
  const [ order, setOrder ] = useState<string>('desc');
  const { data, loading, error } = useQuery(query, {
    variables: { search: search, order },
  });
  const btnHighlightColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  const accountActiveColor = searchType === 'accounts' ? btnHighlightColor : '';
  const projectActiveColor = searchType === 'projects' ? btnHighlightColor : '';

  useEffect(() => {
    if (data && data.projects) setProjects(data.projects);
    if (data && data.accounts) setAccounts(data.accounts);
  }, [data, loading, error]);

  return (
    <Layout>
      <Grid gutter="lg">
        <Grid.Col lg={2}>
          <Card p={0}>
            <List>
              <List.Item style={{ padding: '10px 16px' }} onClick={() => setSearchType('accounts')} sx={(theme) => ({
                backgroundColor: accountActiveColor,
                '&:hover': {
                  backgroundColor: btnHighlightColor,
                },
              })}>
                <span>Accounts</span>
                <Badge style={{ float: 'right' }}>{accounts.length}</Badge>
              </List.Item>
              <Divider/>
              <List.Item style={{ padding: '10px 16px' }} onClick={() => setSearchType('projects')} sx={(theme) => ({
                backgroundColor: projectActiveColor,
                '&:hover': {
                  backgroundColor: btnHighlightColor,
                },
              })}>
                <span>Projects</span>
                <Badge style={{ float: 'right' }}>{projects.length}</Badge>
              </List.Item>
            </List>
          </Card>
          <Card style={{ marginTop: '16px' }}>
            <Select
              label="Sort By"
              value={order}
              data={[ 
                { value: 'desc', label: 'Newest' },
                { value: 'asc', label: 'Oldest' },
              ]}
              onChange={(value) => setOrder(value || '')}
            />
          </Card>
        </Grid.Col>
        <Grid.Col lg={6} style={{ padding: '10px 50px' }}>
          {searchType === 'projects' && projects.map((project: any, index: number) =>
          <div key={index} style={{ marginBottom: 10 }}>
            <Metadata url={project.metaURI}>
              {(data: any) =>
                <NextLink
                  style={{ textDecoration: 'none' }}
                  href={`/${project?.account?.name}/${project.name}`}
                >
                  <ProjectCard
                    title={project?.name} 
                    secondary={data?.name}
                    description={data?.description} 
                    image={data?.image} 
                  />
                </NextLink>
              }
            </Metadata>
            </div>,
          )}
               
          {searchType === 'accounts' && accounts.map((account: any, index: number) =>
          <div key={index} style={{ marginBottom: 10 }}>
            <Metadata url={account.metaURI}>
              {(data: any) =>
                <NextLink
                  style={{ textDecoration: 'none' }}
                  href={`/${account?.name}`}
                >
                  <ProjectCard
                    title={account?.name} 
                    secondary={data?.name}
                    description={data?.description} 
                    image={data?.image} 
                  />
                </NextLink>
              }
            </Metadata>
            </div>,
          )}
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default SearchPage;