import { useQuery } from '@apollo/client';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Main';
import ProjectListCard from '../../components/Projects/ProjectListCard';
import { PROJECT_SEARCH_QUERY } from '../../utils/Apollo/queries';
import { Project } from '../../utils/Apollo/types';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const search = `${router.query.query}`;
  const { data, loading, error } = useQuery(PROJECT_SEARCH_QUERY, {
    variables: { search: search },
  });
  const [ list, setProjects ] = useState<Project[]>([]);

  useEffect(() => {
    if (data && data.projects){
      setProjects(data.projects);
    }
  }, [data, loading, error]);

  return (
    <Layout title="Valist | Search">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-4 lg:gap-8">
        {/* Left column */}
        <div className="grid grid-cols-1 gap-4 relative"/>
        {/* Right column */}
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          {list.map((project: Project) => (
            <Link key={project.id} href={`/${project.team.name}/${project.name}`}>
              <a>
                <ProjectListCard teamName={project.team.name} projectName={project.name} metaURI={project.metaURI} />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;