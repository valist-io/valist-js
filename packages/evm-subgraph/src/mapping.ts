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

  const team = new Team(teamID.toHex());
  team.name = event.params._teamName;
  team.metaURI = event.params._metaURI;
  team.createdTx = event.transaction.hash.toHex();
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'TeamCreated';
  log.team = event.params._teamName;
  log.sender = event.params._sender.toHex();
  log.save();
}

export function handleTeamUpdated(event: TeamUpdated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  let team = Team.load(teamID.toHex());
  if (team == null) team = new Team(teamID.toHex());

  team.name = event.params._teamName;
  team.metaURI = event.params._metaURI;
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'TeamUpdated';
  log.team = event.params._teamName;
  log.sender = event.params._sender.toHex();
  log.save();
}

export function handleTeamMemberAdded(event: TeamMemberAdded): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  let team = Team.load(teamID.toHex());
  if (team == null) team = new Team(teamID.toHex());

  const members = new Set<string>();
  for (let i = 0; i < team.members.length; i++) {
    members.add(team.members[i]);
  }
  members.add(event.params._member.toHex());

  team.name = event.params._teamName;
  team.members = members.values();
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'TeamMemberAdded';
  log.team = event.params._teamName;
  log.sender = event.params._sender.toHex();
  log.member = event.params._member.toHex();
  log.save();
}

export function handleTeamMemberRemoved(event: TeamMemberRemoved): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);

  let team = Team.load(teamID.toHex());
  if (team == null) team = new Team(teamID.toHex());

  const members = new Set<string>();
  for (let i = 0; i < team.members.length; i++) {
    members.add(team.members[i]);
  }
  members.delete(event.params._member.toHex());

  team.name = event.params._teamName;
  team.members = members.values();
  team.updatedTx = event.transaction.hash.toHex();
  team.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'TeamMemberRemoved';
  log.team = event.params._teamName;
  log.sender = event.params._sender.toHex();
  log.member = event.params._member.toHex();
  log.save();
}

export function handleProjectCreated(event: ProjectCreated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  const project = new Project(projectID.toHex());
  project.name = event.params._projectName;
  project.team = teamID.toHex();
  project.metaURI = event.params._metaURI;
  project.createdTx = event.transaction.hash.toHex();
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ProjectCreated';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender.toHex();
  log.save();
}

export function handleProjectUpdated(event: ProjectUpdated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  let project = Project.load(projectID.toHex())
  if (project == null) project = new Project(projectID.toHex());

  project.name = event.params._projectName;
  project.team = teamID.toHex();
  project.metaURI = event.params._metaURI;
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ProjectUpdated';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender.toHex();
  log.save();
}

export function handleProjectMemberAdded(event: ProjectMemberAdded): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  let project = Project.load(projectID.toHex())
  if (project == null) project = new Project(projectID.toHex());

  const members = new Set<string>();
  for (let i = 0; i < project.members.length; i++) {
    members.add(project.members[i]);
  }
  members.add(event.params._member.toHex());

  project.name = event.params._projectName;
  project.team = teamID.toHex();
  project.members = members.values();
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ProjectMemberAdded';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender.toHex();
  log.member = event.params._member.toHex();
  log.save();
}

export function handleProjectMemberRemoved(event: ProjectMemberRemoved): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);

  let project = Project.load(projectID.toHex())
  if (project == null) project = new Project(projectID.toHex());

  const members = new Set<string>();
  for (let i = 0; i < project.members.length; i++) {
    members.add(project.members[i]);
  }
  members.delete(event.params._member.toHex());

  project.name = event.params._projectName;
  project.team = teamID.toHex();
  project.members = members.values();
  project.updatedTx = event.transaction.hash.toHex();
  project.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ProjectMemberRemoved';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.sender = event.params._sender.toHex();
  log.member = event.params._member.toHex();
  log.save();
}

export function handleReleaseCreated(event: ReleaseCreated): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);
  const releaseID = valist.getReleaseID(projectID, event.params._releaseName);

  const release = new Release(releaseID.toHex());
  release.name = event.params._releaseName;
  release.project = projectID.toHex();
  release.metaURI = event.params._metaURI;
  release.createdTx = event.transaction.hash.toHex();
  release.updatedTx = event.transaction.hash.toHex();
  release.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ReleaseCreated';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.release = event.params._releaseName;
  log.sender = event.params._sender.toHex();
  log.save();
}

export function handleReleaseApproved(event: ReleaseApproved): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);
  const releaseID = valist.getReleaseID(projectID, event.params._releaseName);

  let release = Release.load(releaseID.toHex());
  if (release == null) release = new Release(releaseID.toHex());

  const approvers = new Set<string>();
  const rejectors = new Set<string>();

  for(let i = 0; i < release.approvers.length; i++) {
    approvers.add(release.approvers[i]);
  }
  for (let i = 0; i < release.rejectors.length; i++) {
    rejectors.add(release.rejectors[i]);
  }

  approvers.add(event.params._sender.toHex());
  rejectors.delete(event.params._sender.toHex());

  release.name = event.params._releaseName;
  release.project = projectID.toHex();
  release.approvers = approvers.values();
  release.rejectors = rejectors.values();
  release.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ReleaseApproved';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.release = event.params._releaseName;
  log.sender = event.params._sender.toHex();
  log.save();
}

export function handleReleaseRejected(event: ReleaseRejected): void {
  const valist = Valist.bind(event.address);
  const teamID = valist.getTeamID(event.params._teamName);
  const projectID = valist.getProjectID(teamID, event.params._projectName);
  const releaseID = valist.getReleaseID(projectID, event.params._releaseName);

  let release = Release.load(releaseID.toHex());
  if (release == null) release = new Release(releaseID.toHex());

  const approvers = new Set<string>();
  const rejectors = new Set<string>();

  for(let i = 0; i < release.approvers.length; i++) {
    approvers.add(release.approvers[i]);
  }
  for (let i = 0; i < release.rejectors.length; i++) {
    rejectors.add(release.rejectors[i]);
  }

  approvers.delete(event.params._sender.toHex());
  rejectors.add(event.params._sender.toHex());

  release.name = event.params._releaseName;
  release.project = projectID.toHex();
  release.rejectors = rejectors.values();
  release.approvers = approvers.values();
  release.save();

  const log = new Log(event.transaction.hash.toHex());
  log.type = 'ReleaseRejected';
  log.team = event.params._teamName;
  log.project = event.params._projectName;
  log.release = event.params._releaseName;
  log.sender = event.params._sender.toHex();
  log.save();
}
