import axios from 'axios';
import { VALIST_GRAPHQL_URL } from './index';

export type GraphqlQuery = {
    query: string,
    variables?: object,
}

export async function fetchGraphQL(query : GraphqlQuery): Promise<any> {
  const response = await axios({
    url: VALIST_GRAPHQL_URL,
    method: 'post',
    data: query,
  });
  console.log(response.data.data);
}

export function getSubgraphAddress(chainId: number): string {
	switch (chainId) {
    case 137:
      return "https://api.thegraph.com/subgraphs/name/valist-io/valist"
    case 80001:
      return "https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai"
    case 1337:
      return "http://localhost:8000/subgraphs/name/valist/dev"
		default:
			throw new Error(`unsupported network chainId=${chainId}`);
	}
}

// Valist GraphQL Queries
export const RELEASE_QUERY = `
query {
	releases{
	  id
	  name
	  metaURI
	  project{
		id
	  }
	}
}
`

// Query for listing releases for a particular project ID
export const PROJECT_RELEASE_QUERY = `
query($projectID: String!){
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
`

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
  query TeamLogs($account: String, $count: Int){
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
  query Projects($address: String){
    users(where: {id: $address}) {
      id
      accounts {
        name
        projects{
          name
        }
      }
    }
  }
`;

export const USER_PROJECTS_QUERY = `
  query Projects($address: String){
    users(where: {id: $address}) {
      id
      accounts {
        name
        projects{
          name
        }
      }
      projects {
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
         product {
          id
        }
      }
    }
  }
`;

export const ACCOUNT_PROFILE_QUERY = `
  query Account($account: String) {
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
  query Project($search: String){
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
