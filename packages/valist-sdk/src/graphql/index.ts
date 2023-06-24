import axios from 'axios'

export * from './queries'
export * from './types'

export type GraphqlQuery = {
  query: string
  variables?: object
}

export async function fetchGraphQL(
  url: string,
  query: GraphqlQuery
): Promise<any> {
  const { data } = await axios({
    url: url,
    method: 'post',
    data: query
  })
  return data
}

export function getSubgraphUrl(chainId: number): string {
  switch (chainId) {
    case 137:
      return 'https://api.thegraph.com/subgraphs/name/valist-io/valist'
    case 80001:
      return 'https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai'
    case 1337:
      return 'http://localhost:8000/subgraphs/name/valist/dev'
    default:
      throw new Error(`unsupported network chainId=${chainId}`)
  }
}
