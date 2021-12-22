import os from 'os';
import fs from 'fs';
import path from 'path';
import Axios from 'axios';
import axios from 'axios';
import ProgressBar from 'progress';

type ReleaseArtifact = {
  sha256:   string,
  provider: string,
}

type ReleaseMeta = {
  name:         string,             
  readme:       string,             
  license?:      string,           
  dependencies?: string[],          
  artifacts:   Record<string, ReleaseArtifact> 
}

const platforms: Record<string, string> = {
  "win32": "windows",
};

const archs: Record<string, string> = {
  "ia32": "386",
  "x64": "amd64",
};

const release = {
  tag: '0.6.3',
  releaseCID: '/ipfs/QmQxe7fcABoXDegwZWM1zpzqTRvG56vjUxvyxCs1xLJ4zC',
  metaCID: 'QmRBwMae3Skqzc1GmAKBdcnFFPnHeD585MwYtVZzfh9Tkh',
};

function getHostInfo() {
  let platform = String(os.platform());
  let arch = os.arch();

  if (platform in platforms) {
    platform = platforms[platform]
  }

  if (arch in archs) {
    arch = archs[arch];
  }
  
  return {platform, arch};
}

export const parseCID = (url: string) => url.replace('/ipfs/', '');

async function fetchJSONfromIPFS(ipfsHash: string): Promise<any> {
  try {
    const json = await axios.get(`https://gateway.valist.io/ipfs/${parseCID(ipfsHash)}`);
    return json.data;
  } catch (e) {
    const msg = 'Could not fetch JSON from IPFS';
    console.error(msg, e);
    throw e;
  }
}

async function fetchArtifact(cid: string) {  
  const url = `https://gateway.valist.io/${cid}`;
  const filePath = path.resolve(path.dirname(__dirname), 'bin', 'valist');
  const writer = fs.createWriteStream(filePath);

  const { data, headers } = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  const totalLength = headers['content-length'];

  const progressBar = new ProgressBar('-> Downloading [:bar] :percent :etas', {
    width: 40,
    complete: '☯',
    incomplete: ' ',
    renderThrottle: 1,
    total: parseInt(totalLength),
  });

  data.on('data', (chunk: any) => progressBar.tick(chunk.length));
  data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

(async () => {
  console.log("Fetching release", release.tag, "with provider", release.releaseCID);

  const meta: ReleaseMeta = await fetchJSONfromIPFS(release.releaseCID);

  const info = getHostInfo();
  console.log("Detected host platform", info);

  const hostBin = meta.artifacts[`${info.platform}/${info.arch}`]
  console.log("Matching artifact found", hostBin);
  console.log("Downloading Valist Go binary:");

  await fetchArtifact(hostBin.provider);
})();
