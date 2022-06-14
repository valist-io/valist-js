import { gql } from '@apollo/client';
import { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Main';
import ProjectListCard from '../../features/projects/ProjectListCard';
import { PROJECT_SEARCH_QUERY } from '@valist/sdk/dist/graphql';
import { Project } from '../../utils/Apollo/types';
import client from "@/utils/Apollo/client";

export const getServerSideProps = async ({ params }: any) => {
  const search = params.query;
  const { data } = await client.query({
    variables: { search: search },
    query: gql(PROJECT_SEARCH_QUERY),
  });

  return {
    props: {
      data,
    },
    revalidate: 1,
  };
};

const SearchPage: NextPage = (props: any) => {
  const [ list, setProjects ] = useState<Project[]>([]);

  useEffect(() => {
    if (props.data && props.data.projects){
      setProjects(props.data.projects);
    }
  }, [props.data]);

  return (
    <Layout title="Valist | Search">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-4 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 relative"/>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {list.map((project: Project) => (
            <Link key={project.id} href={`/${project.account.name}/${project.name}`}>
              <a>
                <ProjectListCard teamName={project.account.name} projectName={project.name} metaURI={project.metaURI} />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;