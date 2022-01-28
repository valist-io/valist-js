import { gql } from "@apollo/client";

export const ACT_QUERY = gql`
  query Activity{
    activities(first: 5){
      id
      text
    }
  }
`;

export const USER_PROJECTS = gql`
  query Projects($address: String){
    members (where: { address: $address} ){
      id
      address
      team{
        id
        projects{
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
          id
        }
      }
    }
  }
`;

export const TEAM_PROFILE_QUERY = gql`
  query Team($team: String) {
    teams(where: { id: $team} ){
      id
      metaURI
      members{
        id
        address
      }
      projects{
        id
        name
        metaURI
      }
    }
  }
`;


export const PROJECT_SEARCH_QUERY = gql`
  query Project($search: String){
    projects(where: { name_contains: $search} ){
      id
      name
      metaURI
    }
  }
`;

export const PROJECT_PROFILE_QUERY = gql`
  query ProjectProfile($project: String){
    projects(where: { id: $project} ){
      id
      name
      metaURI
      releases{
        tag
        releaseURI
      }
      members{
        role
        address
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