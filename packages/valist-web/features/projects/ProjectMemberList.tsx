import { Paper, Table } from '@mantine/core';
import { Member } from '../../utils/Apollo/types';
import RepoMemberListItem from './ProjectMemberListItem';

interface RepoMemberListItemProps {
  members: Member[]
  removeMember?: (address:string) => void;
}

export default function ManageProjectAccessCard(props: RepoMemberListItemProps): JSX.Element {
  return (
    <Paper shadow="xs" p="0" radius="md" withBorder>
      <Table striped>
        <thead>
          <tr>
            <th>
            </th>
            <th>
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          { props.members.map((member: Member) => <RepoMemberListItem removeMember={props.removeMember} key={member.id} address={member.id} />)}
        </tbody>
      </Table>
    </Paper>
  );
}
