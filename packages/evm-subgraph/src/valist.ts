import {
  TeamUpdated,
  TeamCreated,
  ProjectCreated,
  TeamMemberAdded,
  ReleaseCreated,
} from "../generated/Valist/Valist"
import { Activity, Key, Team, Release, Project } from "../generated/schema"

export function handleTeamUpdate(event: TeamUpdated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let team = Team.load(event.params._teamName);

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (team) {
    team.metaCID = event.params._metaCID;
    team.save();
  }
}

export function handleTeamCreated(event: TeamCreated): void {
  const team = new Team(event.params._teamName);
  team.metaCID = event.params._metaCID;
  team.save();

  const activity = new Activity(event.transaction.hash.toHex());
  activity.text = `created team ${team.id}`
  activity.save();
}

export function handleProjectCreated(event: ProjectCreated): void {
  const team = Team.load(event.params._teamName);
  if (!team) return

  const projectID = `${team.id}/${event.params._projectName}`;
  const repo = new Project(projectID);
  repo.team = event.params._teamName;

  repo.name = event.params._projectName;
  repo.metaCID = event.params._metaCID;
  repo.save();

  const activity = new Activity(event.transaction.hash.toHex());
  activity.text = `created project ${projectID}`
  activity.save();
}

export function handleTeamMemberAdded(event: TeamMemberAdded): void {
  const team = Team.load(event.params._teamName);
  if (!team) return

  const keyID = `${event.params._teamName}/${event.params._member}`
  let key = Key.load(keyID);
  if (!key){
    key = new Key(keyID);
  }

  key.address = event.params._member.toHexString();
  key.role = "teamMember";
  key.team = event.params._teamName;
  key.save();
}

export function handleReleaseCreatedEvent(event: ReleaseCreated): void {
    const team = Team.load(event.params._teamName);
    if (!team) return

    const projectID = `${team.id}/${event.params._projectName}`;
    const project = Project.load(projectID);
    if (!project) return

    const releaseID = `${team.id}/${event.params._projectName}/${event.params._releaseName}`;
    let release = Release.load(releaseID);
    if (!release) {
      release = new Release(releaseID);
    }

    release.project = projectID;
    release.tag = event.params._releaseName;
    release.releaseCID = event.params._metaCID;
    release.save();
}