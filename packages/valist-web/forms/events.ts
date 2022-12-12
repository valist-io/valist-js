import { ApolloCache, Reference, gql } from '@apollo/client';
import { BigNumber, Event, utils } from 'ethers';

function normalizeID(id: BigNumber){
  return utils.hexZeroPad(id.toHexString(), 32);
}

function accountCreated(event: Event, cache: ApolloCache<any>) {
  const { _accountID, _metaURI, _name } = event.args;

  const account = {
    __typename: 'Account',
    id: normalizeID(_accountID),
    metaURI: _metaURI,
    name: _name,
  };

  cache.writeFragment({
    id: cache.identify(account),
    data: account,
    fragment: gql`
      fragment CreateAccount on Account {
        id
        metaURI
        name
      }
    `,
  });
}

function accountUpdated(event: Event, cache: ApolloCache<any>) {
  const { _accountID, _metaURI } = event.args;

  const account = {
    __typename: 'Account',
    id: normalizeID(_accountID),
    metaURI: _metaURI,
  };

  cache.writeFragment({
    id: cache.identify(account),
    data: account,
    fragment: gql`
      fragment UpdateAccount on Account {
        id
        metaURI
      }
    `,
  });
}

function accountMemberAdded(event: Event, cache: ApolloCache<any>) {
  const { _accountID, _member } = event.args;

  const account = {
    __typename: 'Account',
    id: normalizeID(_accountID),
  };

  const user = {
    __typename: 'User',
    id: _member.toLowerCase(),
  };

  cache.updateFragment({
    id: cache.identify(user),
    fragment: gql`
      fragment UpdateUser on User {
        id
        accounts {
          id
        }
      }
    `,
  }, (data) => {
    const accounts = [...data?.accounts, account];
    return { ...user, ...data, accounts };
  });

  cache.updateFragment({
    id: cache.identify(account),
    fragment: gql`
      fragment UpdateAccount on Account {
        id
        members {
          id
        }
      }
    `,
  }, (data) => {
    const members = data?.members ?? [];
    return { ...account, ...data, members: [...members, user] };
  });
}

function accountMemberRemoved(event: Event, cache: ApolloCache<any>) {
  const { _accountID, _member } = event.args;

  const account = {
    __typename: 'Account',
    id: normalizeID(_accountID),
  };

  const user = {
    __typename: 'User',
    id: _member.toLowerCase(),
  };

  cache.updateFragment({
    id: cache.identify(user),
    fragment: gql`
      fragment UpdateUser on User {
        id
        accounts {
          id
        }
      }
    `,
  }, (data) => {
    const accounts = data?.accounts?.filter((other: any) => other.id !== account.id);
    return { ...user, ...data, accounts: accounts ?? [] };
  });

  cache.updateFragment({
    id: cache.identify(account),
    fragment: gql`
      fragment UpdateAccount on Account {
        id
        members {
          id
        }
      }
    `,
  }, (data) => {
    const members = data?.members?.filter((other: any) => other.id !== user.id);
    return { ...account, ...data, members: members ?? [] };
  });
}

function projectCreated(event: Event, cache: ApolloCache<any>) {
  const { _accountID, _projectID, _metaURI, _name } = event.args;

  const account = {
    __typename: 'Account',
    id: normalizeID(_accountID),
  };

  const project = {
    __typename: 'Project',
    id: normalizeID(_projectID),
    metaURI: _metaURI,
    name: _name,
    account,
  };

  cache.updateFragment({
    id: cache.identify(account),
    fragment: gql`
      fragment UpdateAccount on Account {
        id
        projects {
          id
          metaURI
          name
          account {
            id
          }
        }
      }
    `,
  }, (data) => {
    const projects = data?.projects ?? [];
    return { ...account, ...data, projects: [...projects, project] };
  });
}

function projectUpdated(event: Event, cache: ApolloCache<any>) {
  const { _projectID, _metaURI } = event.args;

  const project = {
    __typename: 'Project',
    id: normalizeID(_projectID),
    metaURI: _metaURI,
  };

  cache.writeFragment({
    id: cache.identify(project),
    data: project,
    fragment: gql`
      fragment UpdateProject on Project {
        id
        metaURI
      }
    `,
  });
}

function projectMemberAdded(event: Event, cache: ApolloCache<any>) {
  const { _projectID, _member } = event.args;

  const project = {
    __typename: 'Project',
    id: normalizeID(_projectID),
  };

  const user = {
    __typename: 'User',
    id: _member.toLowerCase(),
  };

  cache.updateFragment({
    id: cache.identify(user),
    fragment: gql`
      fragment UpdateUser on User {
        id
        projects {
          id
        }
      }
    `,
  }, (data) => {
    const projects = data?.projects ?? [];
    return { ...user, ...data, projects: [...projects, project] };
  });

  cache.updateFragment({
    id: cache.identify(project),
    fragment: gql`
      fragment UpdateProject on Project {
        id
        members {
          id
        }
      }
    `,
  }, (data) => {
    const members = data?.members ?? [];;
    return { ...project, ...data, members: [...members, user] };
  });
}

function projectMemberRemoved(event: Event, cache: ApolloCache<any>) {
  const { _projectID, _member } = event.args;

  const project = {
    __typename: 'Project',
    id: normalizeID(_projectID),
  };

  const user = {
    __typename: 'User',
    id: _member.toLowerCase(),
  };

  cache.updateFragment({
    id: cache.identify(user),
    fragment: gql`
      fragment UpdateUser on User {
        id
        projects {
          id
        }
      }
    `,
  }, (data) => {
    const projects = data?.projects?.filter((other: any) => other.id !== project.id);
    return { ...user, ...data, projects: projects ?? [] };
  });

  cache.updateFragment({
    id: cache.identify(project),
    fragment: gql`
      fragment UpdateProject on Project {
        id
        members {
          id
        }
      }
    `,
  }, (data) => {
    const members = data?.members?.filter((other: any) => other.id !== user.id);
    return { ...project, ...data, members: members ?? [] };
  });
}

function releaseCreated(event: Event, cache: ApolloCache<any>) {
  const { _projectID, _releaseID, _metaURI, _name } = event.args;

  const project = {
    __typename: 'Project',
    id: normalizeID(_projectID),
  };

  const release = {
    __typename: 'Release',
    id: normalizeID(_releaseID),
    metaURI: _metaURI,
    name: _name,
    project,
  };

  cache.updateFragment({
    id: cache.identify(project),
    fragment: gql`
      fragment UpdateProject on Project {
        id
        releases(orderBy: blockTime, orderDirection: "desc") {
          id
          metaURI
          name
          project {
            id
          }
        }
      }
    `,
  }, (data) => {
    const releases = data?.releases ?? [];
    return { ...project, ...data, releases: [release, ...releases] };
  });
}

export function handleEvent(event: Event, cache: ApolloCache<any>) {
  switch (event.event) {
    case 'AccountCreated':
      accountCreated(event, cache);
      break;
    case 'AccountUpdated':
      accountUpdated(event, cache);
      break;
    case 'AccountMemberAdded':
      accountMemberAdded(event, cache);
      break;
    case 'AccountMemberRemoved':
      accountMemberRemoved(event, cache);
      break;
    case 'ProjectCreated':
      projectCreated(event, cache);
      break;
    case 'ProjectUpdated':
      projectUpdated(event, cache);
      break;
    case 'ProjectMemberAdded':
      projectMemberAdded(event, cache);
      break;
    case 'ProjectMemberRemoved':
      projectMemberRemoved(event, cache);
      break;
    case 'ReleaseCreated':
      releaseCreated(event, cache);
      break;
    default:
      console.warn(`${event.event} handler not implemented`);
      break;
  }
}