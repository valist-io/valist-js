import { utils } from "ethers";

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