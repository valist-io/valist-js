import { gql } from "@apollo/client";

export const ACT_QUERY = gql`
  query Activity{
    activities(first: 5){
      id
      text
    }
  }
`;

export const PROJECT_SEARCH_QUERY = gql`
  query Project($search: String){
    projects(where: { name_contains: $search} ){
      id
      name
      metaCID
    }
  }
`;

export const ADDR_PROFILE_QUERY =  gql`
  query Keys($address: String){
    keys (where: { address: $address} ){
      id
      address
      org{
        id
        name
        repos{
          id
          metaCID
          name
        }
      }
      repo {
        id
        name
        metaCID
        org{
          name
        }
      }
    }
  }
`;