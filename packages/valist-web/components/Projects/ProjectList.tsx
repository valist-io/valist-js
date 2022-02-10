import { Fragment } from "react";
import ProjectListCard from "./ProjectListCard";
import Link from "next/link";
import { Project } from '../../utils/Apollo/types';

interface ProjectListProps {
  projects: Project[],
  linksDisabled: boolean,
}

export default function ProjectList(props: ProjectListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {props.projects?.map((project: Project) => (
          <Fragment key={project.id}>
            {props.linksDisabled ? 
              <ProjectListCard
                teamName={project.team.name} 
                projectName={project.name}
                metaURI={project.metaURI} />
              :
              <Link href={`/${project.team.name}/${project.name}`}>
                <a>
                  <ProjectListCard
                    teamName={project.team.name} 
                    projectName={project.name}
                    metaURI={project.metaURI} />
                </a>
              </Link>
            }
          </Fragment>
        ))}
      </div>
    </div>
  )
}
