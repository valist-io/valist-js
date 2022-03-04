import getConfig from 'next/config';
import { Release } from '../../utils/Apollo/types';

interface ReleaseListProps {
  projectReleases: Release[],
  teamName: string,
  projectName: string,
}

export default function ReleaseList(props: ReleaseListProps): JSX.Element {
  const { teamName, projectName, projectReleases } = props;
  const { publicRuntimeConfig } = getConfig();
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
                    URL
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectReleases.map((release: Release) => (
                  <tr key={release.metaURI}>
                    <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium text-gray-900">
                      {release.name}
                    </td>
                    <td className="hidden lg:block px-4 py-6 whitespace-nowrap text-left
                    text-sm text-gray-500 hover:text-indigo-500">
                      <a className="cursor-pointer" href={release.metaURI}>
                        {release.metaURI}
                      </a>
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
