import { Fragment } from "react";
import Link from "next/link";
import { Project } from '../../utils/Apollo/types';
import TeamListCard from "./AccountListCard";

interface TeamListProps {
  teams: Project[],
  linksDisabled: boolean,
}

export default function TeamList(props: TeamListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {props.teams?.map((project: Project) => (
          <Fragment key={project.id}>
            {props.linksDisabled ? 
              <TeamListCard teamName={project.name} metaURI={project.metaURI} />
              :
              <Link href={`/${project.name}`}>
                <a>
                  <TeamListCard teamName={project.name} metaURI={project.metaURI} />
                </a>
              </Link>
            }
          </Fragment>
        ))}
      </div>
    </div>
  );
}
