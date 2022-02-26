import EnsResolver from '../Ens';
import AddressIdenticon from '../Identicons/AddressIdenticon';

interface TeamMemberListItemProps {
  id: string
}

function TeamMemberListItem(props: TeamMemberListItemProps): JSX.Element {
  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <AddressIdenticon address={props.id} height={32} width={32} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {EnsResolver ({ address: props.id }) || props.id}
          </p>
        </div>
      </div>
    </li>
  );
}

type TeamMember = {
  id: string
}

interface TeamMemberListProps {
  teamName: string,
  teamMembers: TeamMember[]
}

export default function TeamMemberList(props: TeamMemberListProps): JSX.Element {
  return (
    <section aria-labelledby="recent-hires-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900" id="recent-hires-title">Members</h2>
          <div className="flow-root mt-6">
            <ul className="-my-5 divide-y divide-gray-200">
              { props.teamMembers.map((member: TeamMember) => <TeamMemberListItem key={member.id} id={member.id} />)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
