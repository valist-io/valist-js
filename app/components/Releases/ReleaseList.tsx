import { Release } from '@valist/sdk/dist/types';
import { parseCID } from '@valist/sdk/dist/utils';
import { useState, useEffect } from 'react';

interface ReleaseListProps {
  repoReleases: Release[],
  orgName: string,
  repoName: string,
}

interface ReleaseDownloadsProps {
  releaseCID: string,
}

type ArtifactItem = {
  name: string,
  cid: string,
};

type ReleaseItem = {
  releaseCID: string;
  metaCID: string;
  signers?: string[];
  active: boolean;
};

const ReleaseDownloads = (props: ReleaseDownloadsProps) => {
  const [releaseArtifacts, setReleaseArtifacts] = useState<ArtifactItem[]>([]);
  const [releaseMeta, setReleaseMeta] = useState<any>({});

  const artifactFromName = (artifactName: string) => {
    const cid = releaseMeta.artifacts[artifactName].provider;
    const url = `https://gateway.valist.io${cid}`;
    window.location.assign(url);
  };

  const artifactFromCID = (artifactCID: string) => {
    const cid = parseCID(artifactCID);
    const url = `https://ipfs.io/ipfs/${cid}`;
    window.location.assign(url);
  };

  useEffect(() => {
    const url = `https://ipfs.io${props.releaseCID}`;

    const fetchData = async () => {
      const artifacts: ArtifactItem[] = [];
      try {
        const response = await fetch(url);
        const json = await response.json();
        const artifactNames: string[] = Object.keys(json.artifacts);

        artifactNames.map((artifact) => (
          artifacts.push({
            name: artifact,
            cid: json.artifacts[artifact].provider,
          })
        ));

        setReleaseMeta(json);
        setReleaseArtifacts(artifacts);
      } catch (error) {
        console.log('Error while fetching artifacts:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {(releaseArtifacts.length !== 0)
        ? <select
          defaultValue="artifact"
          onChange={(e) => artifactFromName(e.target.value as string)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300
          focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {releaseArtifacts.map((artifact: ArtifactItem) => (
            <option key={artifact.name}>{artifact.name}</option>
          ))}
        </select>
        : <select
          defaultValue="artifact"
          onClick={() => artifactFromCID(props.releaseCID)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300
        focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option>artifact</option>
        </select>
      }
    </div>
  );
};

export default function ReleaseList(props: ReleaseListProps): JSX.Element {
  const [downloadItems, setDownloadItems] = useState<any>(props.repoReleases.map((release) => ({
    ...release,
    active: false,
  })));

  const toggleDownload = (item: ReleaseItem) => {
    const updatedDownloads = downloadItems.map((current: ReleaseItem) => (current.releaseCID === item.releaseCID
      ? {
        ...current,
        active: !current.active,
      }
      : current));
    setDownloadItems(updatedDownloads);
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tag
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IPFS Hash (CID)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {downloadItems.map((release: any) => (
                  <tr key={release.releaseCID}>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                      {release.tag}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                      <a className="cursor-pointer" href={`https://ipfs.io/ipfs/${parseCID(release.releaseCID)}`}>
                        {parseCID(release.releaseCID)}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!release.active && <div onClick={() => { toggleDownload(release); }}
                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                        Download
                      </div>}
                      {release.active && <ReleaseDownloads releaseCID={release.releaseCID} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}
