import { utils } from "ethers";
import { Project } from "../Apollo/types";
import { License } from "./types";

export async function getLicenses(
  projectList: Project[],
  getLicenseNames: any,
  getLicenseID: any,
) {
  let licenses:License[] = [];

  console.log('projectList', projectList);

  for (let i = 0; i < projectList.length; ++i) {
    const project = projectList[i];
    let licenseNames: string[] = [];

    console.log('project', project);

    try {
      console.log('project info', project.team.name, project.name);
      licenseNames = await getLicenseNames(
        project.team.name,
        project.name,
        0,
        100,
      );

      console.log('licenseNames', licenseNames);
    } catch (err) {
      console.log(err);
    }

    for (let j = 0; j < licenseNames.length; ++j) {
      const id = await getLicenseID(project.id, licenseNames[j]);
      licenses.push({
        id: id.toString(),
        image: '',
        name: licenseNames[j],
        team: project.team.name,
        project: project.name,
        description: '',
      });
    }
  }
  return licenses;
};

export function getTeamID(teamName: string) {
  const nameBytes = utils.toUtf8Bytes(teamName);
  const nameHash = utils.keccak256(nameBytes);
  return utils.keccak256(
    utils.solidityPack(["uint256", "address"], [0x89, nameHash]),
  );
}

export function getProjectID(teamName: string, projectName: string) {
  const teamID = getTeamID(teamName);
  const nameBytes = utils.toUtf8Bytes(projectName);
  const nameHash = utils.keccak256(nameBytes);

  return utils.keccak256(
    utils.solidityPack(["uint256", "address"], [teamID, nameHash]),
  );
}