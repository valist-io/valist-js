import EnsResolver from '../Ens';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import Link from "next/link";

interface OrgAccessCardListItemProps {
  address: string
}

export default function RepoMemberListItem(props: OrgAccessCardListItemProps): JSX.Element {
  return (
    <tr key={props.address}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <AddressIdenticon address={props.address} height={32} width={32} />
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
        <Link href={`/addr/${props.address}`}>
          <a className="cursor-pointer hover:text-indigo-500">
            {EnsResolver ({ address: props.address }) || props.address} 
          </a>
        </Link>
      </td>
    </tr>
  );
}
