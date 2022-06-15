// Valist GraphQL Queries

export const ACCOUNT_QUERY = `
  query Accounts{
    accounts {
      id
      name
      metaURI
    }
  }
`;

export const PROJECT_QUERY = `
  query Projects{
    projects {
      id
      name
      metaURI
      account {
        id
        name
      }
    }
  }
`;

export const RELEASE_QUERY = `
  query Releases{
  	releases{
  	  id
  	  name
  	  metaURI
  	  project{
  		  id
        name
  	  }
  	}
  }
`;

export const ACCOUNT_PROJECT_QUERY = `
  query AccountProjects($accountID: String!){
    account(id: $accountID){
        projects{
            id
            name
            metaURI
        }
    }
  } 
`;

// Query for listing releases for a particular project ID
export const PROJECT_RELEASE_QUERY = `
  query ProjectReleases($projectID: String!){
    project(id: $projectID){
        releases{
            id
            name
            metaURI
            project{
                id
            }
        }
    }
  } 
`;

export const USER_LOGS_QUERY = `
  query UserLogs($address: String, $count: Int){
    logs (where: {sender: $address}, orderBy: blockTime, orderDirection: "desc", first: $count){
      id
      type
      blockTime
      account {
        id
        name
      }
      project {
        id
        name
        account {
          name
        }
      }
      release{
        id
        name
      }
      sender
    }
  }
`;

export const ACCOUNT_LOGS_QUERY = `
  query AccountLogs($account: String, $count: Int){
    logs (where: {account: $account}, first: $count){
      id
      type
      account
      project
      release
      sender
    }
  }
`;

export const PROJECT_LOGS_QUERY = `
  query ProjectLogs($account: String, $project: String, $count: Int){
    logs (where: {account: $account, project: $project}, first: $count){
      id
      type
      account
      project
      release
      sender
    }
  }
`;

export const USER_ACCOUNTS_QUERY = `
  query UserAccounts($address: String!){
    user(id: $address) {
      id
      accounts {
        id
        name
        metaURI
      }
    }
  }
`;

export const USER_PROJECTS_QUERY = `
  query UserProjects($address: String!){
    user(id: $address) {
      id
      projects {
        id
        name
        metaURI
        account {
          id
          name
        }
      }
    }
  }
`;

export const USER_HOMEPAGE_QUERY = `
  query Homepage($address: String){
    users(where: {id: $address}) {
      id
      accounts {
        id
        name
        projects{
          id
          name
          metaURI
          account {
            name
          }
          releases(orderBy: blockTime, orderDirection: "desc") {
            name
            metaURI
            blockTime
          }
        }
        metaURI
      }
      projects {
        id
        name
        metaURI
        account {
          name
        }
        releases(orderBy: blockTime, orderDirection: "desc") {
          name
          metaURI
          blockTime
        }
        product {
          id
        }
      }
    }
  }
`;

export const ACCOUNT_PROFILE_QUERY = `
  query AccountProfile($account: String) {
    accounts(where: { name: $account} ){
      id
      name
      metaURI
      members{
        id
      }
      projects {
        id
        name
        metaURI
        account {
          name
        }
      }
      logs(orderBy: blockTime, orderDirection: "desc"){
        id
        type
        blockTime
        account {
          id
          name
        }
        project {
          id
          name
          account {
            name
          }
        }
        release(orderBy: blockTime, orderDirection: "desc"){
          id
          name
        }
        sender
      }
    }
  }
`;


export const PROJECT_SEARCH_QUERY = `
  query ProjectSearch($search: String){
    projects(where:{name_contains: $search}){
      id
      name
      metaURI
      account {
        name
      }
    }
  }
`;

export const PROJECT_PROFILE_QUERY = `
  query ProjectProfile($projectID: String){
    projects(where: {id: $projectID}){
      id
      name
      metaURI
      account {
        name
      }
      releases(orderBy: blockTime, orderDirection: "desc") {
        name
        metaURI
        blockTime
      }
      members{
        id
      }
      logs(orderBy: blockTime, orderDirection: "desc"){
        id
        type
        blockTime
        account {
          id
          name
        }
        project {
          id
          name
          account {
            name
          }
        }
        release{
          id
          name
        }
        sender
      }
    }
  }
`;

export const ADDR_PROFILE_QUERY = `
  query AddrProfile($address: String){
    keys (where: { address: $address} ){
      id
      address
      account {
        id
        project{
          id
          metaURI
          name
        }
      }
      project {
        id
        name
        metaURI
        account {
          name
        }
      }
    }
  }
`;
