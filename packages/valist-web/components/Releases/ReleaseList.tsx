import { Release } from '../../utils/Apollo/types';
import { parseCID } from '../../utils/Ipfs';
import DownloadBox from './DownloadBox';

interface ReleaseListProps {
  projectReleases: Release[],
  teamName: string,
  projectName: string,
}

export default function ReleaseList(props: ReleaseListProps): JSX.Element {
  const { teamName, projectName, projectReleases} = props;
  return (
    <div className="flex flex-col">
      <div className="-my-2 sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow border-b border-gray-200 sm:rounded-lg bg-white">
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
                    className="hidden lg:block px-4 py-3 text-left text-xs
                    font-medium text-gray-500 uppercase tracking-wider"
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
                {projectReleases.map((release: Release) => (
                  <tr key={release.releaseURI}>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                      {release.tag}
                    </td>
                    <td className="hidden lg:block px-4 py-6 whitespace-nowrap text-left
                    text-sm text-gray-500 hover:text-indigo-500">
                      <a className="cursor-pointer"
                        href={`https://gateway.valist.io/ipfs/${parseCID(release.releaseURI)}`}>
                        {parseCID(release.releaseURI)}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DownloadBox
                        releaseURI={release.releaseURI}
                        releaseName={`${teamName}_${projectName}@${release.tag}`}
                      />
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
