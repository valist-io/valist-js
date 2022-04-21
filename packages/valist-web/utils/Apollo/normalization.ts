import { Team } from "../Valist/types";
import { Project } from "./types";

export function normalizeUserProjects(teamList: Team[], projectList:Project[]) {
  const rawTeams: Team[] = teamList;
  const teamNames = [];
  let teams: Record<string, Project[]> = {};

  if (teamList) {
    for (let i = 0; i < rawTeams.length; i++) {
      teams[rawTeams[i].name] = rawTeams[i].projects;
      teamNames.push(rawTeams[i].name);
    }
  }

  if (projectList) {
    const rawProjects: Project[] = projectList;

    for (let i = 0; i < rawProjects.length; i++) {
      let projectTeamName = rawProjects[i].account.name;
      if (!Object.keys(teams).includes(projectTeamName)) {
        if (teams[projectTeamName]?.includes(rawProjects[i])) {
          teams[projectTeamName].push(rawProjects[i]);
        } else {
          teams[projectTeamName] = [rawProjects[i]];
          teamNames.push(rawProjects[i].account.name);
        }
      }
    }
  }

  return { teamNames, teams };
}

export function getProjectNames(teams:Record<string, Project[]>, teamName: string) {
  const teamProjects = teams[teamName];
  const projectNames:string[] = [];

  for (let i = 0; i < teamProjects?.length; i++) {
    projectNames.push(teamProjects[i].name);
  }

  return projectNames;
}