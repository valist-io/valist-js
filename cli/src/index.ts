import Valist from '@valist/sdk';
import os from 'os';
import fs from 'fs';
import path from 'path';
import Axios from 'axios';
import ProgressBar from 'progress';
import { ReleaseMeta } from '../../sdk/dist/types';

// this will be the tag downloaded by the npm module
// bump this to target a different release
const tag = '0.6.0';

const platforms: Record<string, string> = {
  "win32": "windows",
};

const archs: Record<string, string> = {
  "ia32": "386",
  "x64": "amd64",
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
  const valist = new Valist({
     web3Provider: 'https://rpc.valist.io',
     metaTx: false, 
  });

  await valist.connect();

  const release = await valist.getReleaseByTag('valist', 'cli', tag);
  console.log("Fetching release", release.tag, "with provider", release.releaseCID);

  const meta: ReleaseMeta = await valist.fetchJSONfromIPFS(release.releaseCID);

  const info = getHostInfo();
  console.log("Detected host platform", info);

  const hostBin = meta.artifacts[`${info.platform}/${info.arch}`]
  console.log("Matching artifact found", hostBin);
  console.log("Downloading Valist Go binary:");

  await fetchArtifact(hostBin.provider);
})();