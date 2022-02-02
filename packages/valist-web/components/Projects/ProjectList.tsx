import { Fragment, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ProjectListCard from "./ProjectListCard";
import Link from "next/link";
import { USER_PROJECTS } from "../../utils/Apollo/queries";
import { Project } from '../../utils/Apollo/types';

interface ProjectListProps {
  address: string,
}

export default function ProjectList(props: ProjectListProps) {
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const { data, loading, error } = useQuery(USER_PROJECTS, {
    variables: { address: props.address.toLowerCase() },
  });

  useEffect(() => {
    if (data && data.users && data.users[0]) {
      setUserProjects(data.users[0].projects);
    } else if (data) {
      setUserProjects([]);
    }
  }, [data, loading, error, setUserProjects, props.address]);

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {userProjects && userProjects.map((project: Project) => (
          <Fragment key={project.id}>
            <Link href={`/${project.team.name}/${project.name}`}>
              <a>
                <ProjectListCard 
                  teamName={project.team.name} 
                  projectName={project.name}
                  metaURI={project.metaURI} />
              </a>
            </Link>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
