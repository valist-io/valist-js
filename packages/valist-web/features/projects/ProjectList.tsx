import { Fragment } from "react";
import ProjectListCard from "./ProjectListCard";
import Link from "next/link";
import { Project } from '../../utils/Apollo/types';
import { Grid } from "@mantine/core";

interface ProjectListProps {
  projects: Project[],
  linksDisabled: boolean,
}

export default function ProjectList(props: ProjectListProps) {
  return (
    <div>
      <Grid gutter="md">
        {props.projects?.map((project: Project) => (
          <Grid.Col style={{ marginTop: "1rem" }} xs={12} md={6} lg={4} key={project.id}>
            {props.linksDisabled ? 
              <ProjectListCard
                teamName={project.account.name} 
                projectName={project.name}
                metaURI={project.metaURI} />
              :
              <Link href={`/${project.account.name}/${project.name}`}>
                <a>
                  <ProjectListCard
                    teamName={project.account.name} 
                    projectName={project.name}
                    metaURI={project.metaURI} />
                </a>
              </Link>
            }
          </Grid.Col>
        ))}
        </Grid>
      </div>
  );
}
