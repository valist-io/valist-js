import { Paper, Table } from '@mantine/core';
import { Release } from '../../utils/Apollo/types';

interface ReleaseListProps {
  projectReleases: Release[],
  teamName: string,
  projectName: string,
}

export default function ReleaseList(props: ReleaseListProps): JSX.Element {
  return (
    <Paper shadow="xs" p="0" radius="md" withBorder>
      <Table striped>
          <thead>
            <tr>
              <th>
                Tag
              </th>
              <th>
                URL
              </th>
            </tr>
          </thead>
          <tbody>
            {props.projectReleases.map((release: Release) => (
              <tr key={release.metaURI}>
                <td>
                  {release.name}
                </td>
                <td>
                  <a className="cursor-pointer" href={release.metaURI}>
                    {release.metaURI}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
      </Table>
    </Paper>
  );
}
