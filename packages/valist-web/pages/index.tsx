import type { NextPage } from 'next';
import { useContext } from 'react';
import { useNetwork } from 'wagmi';
import { useQuery, gql } from '@apollo/client';
import { Title, Group, Grid } from '@mantine/core';
import { Button, ProjectCard } from '@valist/ui';
import { NextLink } from '@mantine/next';
import { Layout } from '@/components/Layout';
import { AccountContext } from '@/components/AccountProvider';
import { Metadata } from '@/components/Metadata';

const query = gql`
  query AccountProjects($accountId: String!){
    account(id: $accountId){
      projects {
        id
        name
        metaURI
      }
    }
  }
`;

const Dashboard: NextPage = () => {
  const { chain } = useNetwork();
  const { account } = useContext(AccountContext);

  const { data } = useQuery(query, { 
    variables: { accountId: account?.id },
  });

  const projects = data?.account?.projects ?? [];

  return (
    <Layout>
      <Group position="apart" mb="xl">
        <Title>Dashboard</Title>
        <NextLink href="/-/create/project">
          <Button>Create Project</Button>
        </NextLink>
      </Group>
      <Grid>
        <Grid.Col lg={8}>
          <Grid gutter={24}>
            {projects.map((project, index) => 
              <Grid.Col lg={6} key={index}>
                <Metadata url={project.metaURI}>
                  {(data: any) => 
                    <ProjectCard
                      title={project.name} 
                      secondary={data?.name}
                      description={data?.description} 
                      image={data?.image} /> 
                  }
                </Metadata>
              </Grid.Col>
            )}
          </Grid>
        </Grid.Col>
        <Grid.Col lg={4}>
        </Grid.Col>
      </Grid>
    </Layout>
  );
};

export default Dashboard;