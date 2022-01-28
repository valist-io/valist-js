import { Fragment, useContext, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import ProjectCard from "./ProjectCard";
import Link from "next/link";
import { USER_PROJECTS } from "../../utils/Apollo/queries";
import AccountContext from "../Accounts/AccountContext";

type Project = {
  id: string,
  name: string,
  metaURI: string,
};

type Member = {
  team?: {
    id: string,
    name: string,
    projects: Project[],
  },
  project?: Project & { team: { id: string, name: string }},
};

type TeamList = Map<string, Map<string, string>>;

export default function ProjectList() {
  const accountCtx = useContext(AccountContext);
  const { data, loading, error } = useQuery(USER_PROJECTS, {
    variables: { address: accountCtx.address.toLowerCase() },
  });

  const [ TeamList, setTeamList ] = useState<TeamList>(new Map());

  const normalizeData = (members: Member[]) => {
    const teams: TeamList = new Map();

    const addProject = (teamName: string, projectName: string, metaCID: string) => {
      if (!teams.has(teamName)) teams.set(teamName, new Map());
      const team = teams.get(teamName) as Map<string, string>;
      team.set(projectName, metaCID);
    }

    members.forEach(member => {
      if (member.team) {
        for (const project of member.team.projects) {
          addProject(member.team.id, project.name, project.metaURI);
        }
      } else if (member.project) {
        addProject(member.project.team.name, member.project.name, member.project.metaURI);
      } else {}
    });
    return teams;
  }

  useEffect(() => {
    if (data && data.members) {
      setTeamList(normalizeData(data.members));
    }
  }, [data, loading, error]);

  return (
  <div>
    <div className="grid grid-cols-2 gap-2">
      {Array.from(TeamList.entries(), ([teamName, repos]) => (
        <Fragment key={teamName}>
            {Array.from(repos.entries(), ([projectName, metaCID]) => (
              <Link key={projectName} href={`/${teamName}/${projectName}`}>
                <a>
                  <ProjectCard teamName={teamName} projectName={projectName} metaCID={metaCID} />
                </a>
              </Link>
            ))}
        </Fragment>
      ))}
    </div>
  </div>)
}
