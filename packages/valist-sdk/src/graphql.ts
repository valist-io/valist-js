
// Query for listing all the releases
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
export const VALIST_GRAPHQL_URL = 'https://api.thegraph.com/subgraphs/name/valist-io/valist'

export async function fetchReleases(requestBody: BodyInit | null | undefined) : Promise<any> {
    const res = await fetch(VALIST_GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody
    });
    
    const json = await res.json();
    const releases = await json.data;
    return await releases;
}
    
