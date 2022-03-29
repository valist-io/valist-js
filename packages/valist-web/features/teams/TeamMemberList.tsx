import { useContext, useEffect, useState } from 'react';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import Web3Context from '../valist/Web3Context';

interface TeamMemberListItemProps {
  id: string
}

function TeamMemberListItem(props: TeamMemberListItemProps): JSX.Element {
  const web3Ctx = useContext(Web3Context);
  const [ens, setEns] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let value = null;

      if (props.id !== '0x0') {
        try {
          value = await web3Ctx.reverseEns(props.id);
        } catch (err) {}
      }

      setEns(value);
    })();
  }, [props.id, web3Ctx.reverseEns]);

  return (
    <li className="py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <AddressIdenticon address={props.id} height={32} width={32} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {ens || props.id}
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
