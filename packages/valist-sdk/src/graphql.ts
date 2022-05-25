import axios from 'axios'
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


    
