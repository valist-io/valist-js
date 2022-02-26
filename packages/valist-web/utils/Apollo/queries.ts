import { gql } from "@apollo/client";

export const USER_LOGS_QUERY = gql`
  query UserLogs($address: String){
    logs (where: {member: $address}, first: 5){
      id
      type
      team
      project
      release
      sender
    }
  }
`;

export const USER_PROJECTS = gql`
  query Projects($address: String){
    users(where: {id: $address}) {
      id
      teams {
        name
        projects{
          name
        }
      }
      projects {
        id
        name
        metaURI
        team {
          name
        }
      }
    }
  }
`;

export const TEAM_PROFILE_QUERY = gql`
  query Team($team: String) {
    teams(where: { name: $team} ){
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
        team {
          name
        }
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
      team{
        name
      }
    }
  }
`;

export const PROJECT_PROFILE_QUERY = gql`
  query ProjectProfile($project: String){
    projects(where: {id: $project}){
      id
      name
      metaURI
      team{
        name
      }
      releases{
        name
        metaURI
      }
      members{
        id
      }
    }
  }
`;

export const ADDR_PROFILE_QUERY =  gql`
  query AddrProfile($address: String){
    keys (where: { address: $address} ){
      id
      address
      team{
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
        team{
          name
        }
      }
    }
  }
`;