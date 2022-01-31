import ProjectCard from "../Projects/ProjectCard";
import Link from "next/link";
import { Project } from "../../utils/Apollo/types";

interface TeamProjectListProps {
  projects: Project[],
}

export default function ProjectList(props: TeamProjectListProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
          {props.projects.map((project) => (
            <Link key={project.id} href={`${project.team.name}/${project.name}`}>
              <a>
                <ProjectCard teamName={project.team.name} projectName={project.name} metaCID={project.metaURI} />
              </a>
            </Link>
          ))}
      </div>
    </div>)
}