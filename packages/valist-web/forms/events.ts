import { ApolloCache, Reference, gql } from '@apollo/client';
import { BigNumber, Event, utils } from 'ethers';

import AccountCreated from '@/graphql/fragments/AccountCreated.graphql';
import AccountMembers from '@/graphql/fragments/AccountMembers.graphql';
import AccountProjects from '@/graphql/fragments/AccountProjects.graphql';
import ProjectMembers from '@/graphql/fragments/ProjectMembers.graphql';
import ProjectReleases from '@/graphql/fragments/ProjectReleases.graphql';
import UserAccounts from '@/graphql/fragments/UserAccounts.graphql';

const entityID = (id: BigNumber) => utils.hexZeroPad(id.toHexString(), 32);

function accountCreated(event: Event, cache: ApolloCache<any>) {
  const accountId = entityID(event.args?.['_accountID']);

  cache.writeFragment({
    id: `Account:${accountId}`,
    fragment: AccountCreated,
    data: {
      __typename: 'Account',
      id: accountId,
      metaURI: event.args?.['_metaURI'],
      name: event.args?.['_name'],
    },
  });
}

function accountUpdated(event: Event, cache: ApolloCache<any>) {
  const accountId = entityID(event.args?.['_accountID']);

  cache.modify({
    id: `Account:${accountId}`,
    fields: {
      metaURI(existingMetaURI) {
        return event.args?.['_metaURI'];
      },
    },
  });
}

function accountMemberAdded(event: Event, cache: ApolloCache<any>) {
  const accountId = entityID(event.args?.['_accountID']);
  const userId = event.args?.['_member']?.toLowerCase();
  
  const user = {
    __typename: 'User',
    id: userId,
  };

  // add the user to the account
  const accountRef = cache.updateFragment({ 
    id: `Account:${accountId}`, 
    fragment: AccountMembers,
  }, (data: any) => {
    const members = data?.members ?? [];
    return { members: [...members, user] };
  });

  // add the account to the user
  cache.modify({
    id: `User:${userId}`,
    fields: {
      accounts(existingAccounts = []) {
        return [...existingAccounts, accountRef];
      },
    },
  });
}

function accountMemberRemoved(event: Event, cache: ApolloCache<any>) {
  const accountId = entityID(event.args?.['_accountID']);
  const userId = event.args?.['_member']?.toLowerCase();

  // remove the user from the account
  cache.updateFragment({ 
    id: `Account:${accountId}`, 
    fragment: AccountMembers,
  }, (data: any) => {
    const members = data?.members?.filter((other: any) => other.id !== userId);
    return { members };
  });

  // remove the account from the user
  cache.modify({
    id: `User:${userId}`,
    fields: {
      accounts(existingAccounts = [], { readField }) {
        return existingAccounts.filter(
          (ref: Reference) => accountId !== readField('id', ref)
        );
      },
    },
  });
}

function projectCreated(event: Event, cache: ApolloCache<any>) {
  const accountId = entityID(event.args?.['_accountID']);
  const projectId = entityID(event.args?.['_projectID']);

  const project = {
    __typename: 'Project',
    id: projectId,
    metaURI: event.args?.['_metaURI'],
    name: event.args?.['_name'],
  };

  cache.updateFragment({ 
    id: `Account:${accountId}`,
    fragment: AccountProjects,
  }, (data) => {
    const projects = data?.projects ?? [];
    return { projects: [...projects, project] };
  });
}

function projectUpdated(event: Event, cache: ApolloCache<any>) {
  const projectId = entityID(event.args?.['_projectID']);

  cache.modify({
    id: `Project:${projectId}`,
    fields: {
      metaURI(existingMetaURI) {
        return event.args?.['_metaURI'];
      },
    },
  });
}

function projectMemberAdded(event: Event, cache: ApolloCache<any>) {
  const projectId = entityID(event.args?.['_projectID']);
  const userId = event.args?.['_member']?.toLowerCase();
  
  const user = {
    __typename: 'User',
    id: userId,
  };

  // add the user to the project
  const projectRef = cache.updateFragment({ 
    id: `Project:${projectId}`, 
    fragment: ProjectMembers,
  }, (data: any) => {
    const members = data?.members ?? [];
    return { members: [...members, user] };
  });

  // add the project to the user
  cache.modify({
    id: `User:${userId}`,
    fields: {
      projects(existingProjects = []) {
        return [...existingProjects, projectRef];
      },
    },
  });
}

function projectMemberRemoved(event: Event, cache: ApolloCache<any>) {
  const projectId = entityID(event.args?.['_projectID']);
  const userId = event.args?.['_member']?.toLowerCase();

  // remove the user from the project
  cache.updateFragment({ 
    id: `Project:${projectId}`, 
    fragment: ProjectMembers,
  }, (data: any) => {
    const members = data?.members?.filter((other: any) => other.id !== userId);
    return { members };
  });

  // remove the project from the user
  cache.modify({
    id: `User:${userId}`,
    fields: {
      projects(existingProjects = [], { readField }) {
        return existingProjects.filter(
          (ref: Reference) => projectId !== readField('id', ref)
        );
      },
    },
  });
}

function releaseCreated(event: Event, cache: ApolloCache<any>) {
  const projectId = entityID(event.args?.['_projectID']);
  const releaseId = entityID(event.args?.['_releaseID']);

  const release = {
    __typename: 'Release',
    id: releaseId,
    metaURI: event.args?.['_metaURI'],
    name: event.args?.['_name'],
  };

  cache.updateFragment({ 
    id: `Project:${projectId}`,
    fragment: ProjectReleases,
  }, (data) => {
    const releases = data?.releases ?? [];
    return { releases: [release, ...releases] };
  });
}

function releaseApproved(event: Event, cache: ApolloCache<any>) {
  console.warn(`${event.event} handler not implemented`);
}

function releaseRevoked(event: Event, cache: ApolloCache<any>) {
  console.warn(`${event.event} handler not implemented`);
}

export function handleEvent(event: Event, cache: ApolloCache<any>) {
  switch (event.event) {
    case 'AccountCreated':
      return accountCreated(event, cache);
    case 'AccountUpdated':
      return accountUpdated(event, cache);
    case 'AccountMemberAdded':
      return accountMemberAdded(event, cache);
    case 'AccountMemberRemoved':
      return accountMemberRemoved(event, cache);
    case 'ProjectCreated':
      return projectCreated(event, cache);
    case 'ProjectUpdated':
      return projectUpdated(event, cache);
    case 'ProjectMemberAdded':
      return projectMemberAdded(event, cache);
    case 'ProjectMemberRemoved':
      return projectMemberRemoved(event, cache);
    case 'ReleaseCreated':
      return releaseCreated(event, cache);
    case 'ReleaseApproved':
      return releaseApproved(event, cache);
    case 'ReleaseRevoked':
      return releaseRevoked(event, cache);
  }
}