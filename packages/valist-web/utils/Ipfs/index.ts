export const parseCID = (url: string) => url.replace('/ipfs/', '');

export const fetchJSONfromIPFS = async(ipfsHash: string): Promise<any> => {
  const url = `http://localhost:8080/ipfs/${parseCID(ipfsHash)}`

  try {
    const response = await fetch(url);
    const json = await response.text();
    return json;
  } catch (e) {
    const msg = 'Could not fetch JSON from IPFS';
    console.error(msg, e);
    throw e;
  }
}