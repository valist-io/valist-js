import { useQuery, gql } from '@apollo/client';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Main';
import ProjectListCard from '../../features/projects/ProjectListCard';
import { Account, ALL_SEARCH_QUERY } from '@valist/sdk/dist/graphql';
import { Project } from '../../utils/Apollo/types';
import { Badge, Card, Center, Divider, Grid, List, Select } from '@mantine/core';
import AccountListCard from '@/features/accounts/AccountListCard';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const search = `${router.query.query}`;
  const { data, loading, error } = useQuery(gql(ALL_SEARCH_QUERY), {
    variables: { search: search },
  });
  const [ projects, setProjects ] = useState<Project[]>([]);
  const [ accounts, setAccounts ] = useState<Account[]>([]);
  const [searchType, setSearchType] = useState<string>('projects');;
  const [ order, setOrder ] = useState<string>('Newest');

  useEffect(() => {
    if (data && data.projects) setProjects(data.projects);
    if (data && data.accounts) setAccounts(data.accounts);
  }, [data, loading, error]);

  return (
    <Layout title="Valist | Search">
      <Grid gutter="lg">
        <Grid.Col lg={2}>
          <Card style={{ padding: '0 16px' }}>
            <List>
              <List.Item style={{ padding: '10px 0' }} onClick={() => setSearchType('accounts')} sx={(theme) => ({
                '&:hover': {
                  backgroundColor: theme.colors.dark[4],
                },
              })}>
                <span>Accounts</span>
                <Badge style={{ float: 'right' }}>{accounts.length}</Badge>
              </List.Item>
              <Divider/>
              <List.Item style={{ padding: '10px 0' }} onClick={() => setSearchType('projects')} sx={(theme) => ({
                '&:hover': {
                  backgroundColor: theme.colors.dark[4],
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
              data={['Newest', 'Oldest']}
              onChange={(value) => setOrder(value || '')}
            />
          </Card>
        </Grid.Col>
        <Grid.Col lg={6} style={{ padding: '10px 50px' }}>
          {searchType === 'projects' && projects.map((project: Project) => (
            <Link key={project.id} href={`/${project.account.name}/${project.name}`} passHref>
              <a>
                <div style={{ marginBottom: '25px' }}>
                  <ProjectListCard teamName={project.account.name} projectName={project.name} metaURI={project.metaURI} />
                </div>
              </a>
            </Link>
          ))}

          {searchType === 'accounts' && accounts.map((account: Account) => (
            <Link key={account.id} href={`/${account.name}`} passHref>
              <a>
                <div style={{ marginBottom: '25px' }}>
                  <AccountListCard teamName={account.name || ''} metaURI={account.metaURI || ''}  />
                </div>
              </a>
            </Link>
          ))}
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default SearchPage;