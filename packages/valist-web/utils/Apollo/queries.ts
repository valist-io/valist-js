import { gql } from "@apollo/client";

export const RECENT_LOGS_QUERY = gql`
  query RecentLogs{
    logs (first: 5){
      id
      type
      team
      project
      release
      member
      sender
    }
  }
`;

export const USER_LOGS_QUERY = gql`
  query UserLogs($address: String, $count: Int){
    logs (where: {sender: $address}, first: $count){
      id
      type
      team
      project
      release
      member
      sender
    }
  }
`;

export const TEAM_LOGS_QUERY = gql`
  query TeamLogs($team: String, $count: Int){
    logs (where: {team: $team}, first: $count){
      id
      type
      team
      project
      release
      member
      sender
    }
  }
`;

export const PROJECT_LOGS_QUERY = gql`
  query ProjectLogs($team: String, $project: String, $count: Int){
    logs (where: {team: $team, project: $project}, first: $count){
      id
      type
      team
      project
      release
      member
      sender
    }
  }
`;

export const USER_TEAMS = gql`
  query Projects($address: String){
    users(where: {id: $address}) {
      id
      teams {
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

export const USER_HOMEPAGE = gql`
  query Homepage($address: String){
    users(where: {id: $address}) {
      id
      teams {
        name
        projects{
          name
        }
        metaURI
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
      releases(orderBy: createdAt, orderDirection: "desc",) {
        name
        metaURI
        createdAt
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