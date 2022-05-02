import { gql } from "@apollo/client";

export const USER_LOGS_QUERY = gql`
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

export const ACCOUNT_LOGS_QUERY = gql`
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

export const PROJECT_LOGS_QUERY = gql`
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

export const USER_ACCOUNTS = gql`
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

export const USER_PROJECTS = gql`
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

export const USER_HOMEPAGE = gql`
  query Homepage($address: String){
    users(where: {id: $address}) {
      id
      accounts {
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

export const ACCOUNT_PROFILE_QUERY = gql`
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


export const PROJECT_SEARCH_QUERY = gql`
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

export const PROJECT_PROFILE_QUERY = gql`
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

export const ADDR_PROFILE_QUERY =  gql`
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