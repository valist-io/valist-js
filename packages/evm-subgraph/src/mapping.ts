import { Team, Release, Project, Log } from "../generated/schema";

import {
  Valist,
  TeamCreated,
  TeamUpdated,
  TeamMemberAdded,
  TeamMemberRemoved,
  ProjectCreated,
  ProjectUpdated,
  ProjectMemberAdded,
  ProjectMemberRemoved,
  ReleaseCreated,
  ReleaseApproved,
  ReleaseRejected
} from "../generated/Valist/Valist";

export function handleTeamCreated(event: TeamCreated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  const team = new Team(teamID);
  team.name = event.params._teamName;
  team.metaURI = event.params._metaURI;
  team.createdTx = event.transaction.hash.toHex();
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.sender = event.params._sender;
  log.save();
}

export function handleTeamUpdated(event: TeamUpdated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  let team = Team.load(teamID);
  if (team == null) team = new Team(teamID);

  team.name = event.params._teamName;
  team.metaURI = event.params._metaURI;
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.sender = event.params._sender;
  log.save();
}

export function handleTeamMemberAdded(event: TeamMemberAdded): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  let team = Team.load(teamID);
  if (team == null) team = new Team(teamID);

  team.name = event.params._teamName;
  team.members.push(event.params._member);
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.sender = event.params._sender;
  log.member = event.params._member;
  log.save();
}

export function handleTeamMemberRemoved(event: TeamMemberRemoved): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  let team = Team.load(teamID);
  if (team == null) team = new Team(teamID);

  team.name = event.params._teamName;
  team.members = team.members.filter((member) => member !== event.params._member);
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.sender = event.params._sender;
  log.member = event.params._member;
  log.save();
}

export function handleProjectCreated(event: ProjectCreated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  const project = new Project(projectID);
  project.name = event.params._projectName;
  project.team = teamID;
  project.metaURI = event.params._metaURI;
  project.createdTx = event.transaction.hash.toHex();
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender;
  log.save();
}

export function handleProjectUpdated(event: ProjectUpdated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  let project = Project.load(projectID)
  if (project == null) project = new Project(projectID);

  project.name = event.params._projectName;
  project.team = teamID;
  project.metaURI = event.params._metaURI;
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender;
  log.save();
}

export function handleProjectMemberAdded(event: ProjectMemberAdded): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  let project = Project.load(projectID)
  if (project == null) project = new Project(projectID);

  project.name = event.params._projectName;
  project.team = teamID;
  project.members.push(events.params._member);
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender;
  log.member = event.params._member;
  log.save();
}

export function handleProjectMemberRemoved(event: ProjectMemberRemoved): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  let project = Project.load(projectID)
  if (project == null) project = new Project(projectID);

  project.name = event.params._projectName;
  project.team = teamID;
  project.members = project.members.filter((member) => member !== event.params._member);
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender;
  log.member = event.params._member;
  log.save();
}

export function handleReleaseCreated(event: ReleaseCreated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);
  const releaseID = valist.getReleaseID(projectID, event.params._releaseName);

  const release = new Release(releaseID);
  release.name = event.params._releaseName;
  release.project = projectID;
  release.metaURI = event.params._metaURI;
  release.createdTx = event.transaction.hash.toHex();
  release.updatedTx = event.transaction.hash.toHex();
  release.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.release = event.params._releaseName;
  log.sender = event.params._sender;
  log.save();
}

export function handleReleaseApproved(event: ReleaseApproved): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);
  const releaseID = valist.getReleaseID(projectID, event.params._releaseName);

  let release = Release.load(releaseID);
  if (release == null) release = new Release(releaseID);

  release.name = event.params._releaseName;
  release.project = projectID;
  release.approvers.push(_sender);
  release.rejectors = release.rejectors.filter((member) => member !== event.params._sender);
  release.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.release = event.params._releaseName;
  log.sender = event.params._sender;
  log.save();
}

export function handleReleaseRejected(event: ReleaseRejected): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);
  const releaseID = valist.getReleaseID(projectID, event.params._releaseName);

  let release = Release.load(releaseID);
  if (release == null) release = new Release(releaseID);

  release.name = event.params._releaseName;
  release.project = projectID;
  release.rejectors.push(_sender);
  release.approvers = release.approvers.filter((member) => member !== event.params._sender);
  release.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = event.logType;
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.release = event.params._releaseName;
  log.sender = event.params._sender;
  log.save();
}
