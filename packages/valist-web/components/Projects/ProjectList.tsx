import { Fragment, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ProjectCard from "./ProjectCard";
import Link from "next/link";
import { USER_PROJECTS } from "../../utils/Apollo/queries";
import AccountContext from "../Accounts/AccountContext";
import { Project } from '../../utils/Apollo/types';

export default function ProjectList() {
  const accountCtx = useContext(AccountContext);
  const [userProjects, setUserProjects] = useState<Project[]>([{
    id: 'loading',
    name: 'loading',
    metaURI: 'loading',
    team: {name: 'loading'}
  }]);
  const { data, loading, error } = useQuery(USER_PROJECTS, {
    variables: { address: accountCtx.address.toLowerCase() },
  });

  useEffect(() => {
    if (data && data.users && data.users[0]) {
      setUserProjects(data.users[0].projects);
    }
  }, [data, loading, error]);

  return (
  <div>
    <div className="grid grid-cols-2 gap-2">
      {userProjects && userProjects.map((project: Project) => (
        <Fragment key={project.id}>
          <Link href={`/${project.team.name}/${project.name}`}>
            <a>
              <ProjectCard 
                teamName={project.team.name} 
                projectName={project.name}
                metaCID={project.metaURI} />
            </a>
          </Link>
        </Fragment>
      ))}
    </div>
  </div>)
}
