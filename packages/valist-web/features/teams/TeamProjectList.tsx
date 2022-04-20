import Link from "next/link";
import { Project } from "../../utils/Apollo/types";
import { Fragment } from "react";
import ProjectCard from '../../features/projects/ProjectListCard';

interface TeamProjectListProps {
  projects: Project[],
  linksDisabled: boolean,
}

export default function ProjectList(props: TeamProjectListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {props.projects.map((project) => (
            <Fragment key={project.name}>
              {props.linksDisabled ? 
                <ProjectCard teamName={project.account.name} projectName={project.name} metaURI={project.metaURI} />
              :
                <Link key={project.id} href={`${project.account.name}/${project.name}`}>
                  <a>
                    <ProjectCard teamName={project.account.name} projectName={project.name} metaURI={project.metaURI} />
                  </a>
                </Link>
              }
            </Fragment>
          ))}
      </div>
    </div>);
}