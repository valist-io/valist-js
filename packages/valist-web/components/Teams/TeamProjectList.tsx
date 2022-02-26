import ProjectCard from "../Projects/ProjectListCard";
import Link from "next/link";
import { Project } from "../../utils/Apollo/types";

interface TeamProjectListProps {
  projects: Project[],
}

export default function ProjectList(props: TeamProjectListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {props.projects.map((project) => (
            <Link key={project.id} href={`${project.team.name}/${project.name}`}>
              <a>
                <ProjectCard teamName={project.team.name} projectName={project.name} metaURI={project.metaURI} />
              </a>
            </Link>
          ))}
      </div>
    </div>)
}