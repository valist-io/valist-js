import { Fragment, useEffect, useState } from "react";
import { useQuery, DocumentNode } from "@apollo/client";
import ProjectCard from "../Projects/ProjectCard";
import Link from "next/link";

type Project = {
  id: string,
  name: string,
  metaURI: string,
}

interface TeamProjectListProps {
  teamName: string,
  projects: Project[],
}

export default function ProjectList(props: TeamProjectListProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
          {props.projects.map((project) => (
            <Link key={project.id} href={`/${project.id}`}>
              <a>
                <ProjectCard teamName={props.teamName} projectName={project.name} metaCID={project.metaURI} />
              </a>
            </Link>
          ))}
      </div>
    </div>)
}