import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import Web3Context from "../valist/Web3Context";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';

interface ProjectMemberListItemProps {
  address: string
}

export default function ProjectMemberListItem(props: ProjectMemberListItemProps): JSX.Element {
  const web3Ctx = useContext(Web3Context);
  const [ens, setEns] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let value = null;

      if (props.address !== '0x0') {
        try {
          value = await web3Ctx.reverseEns(props.address);
        } catch (err) {}
      }

      setEns(value);
    })();
  }, [props.address, web3Ctx.reverseEns]);

  
  return (
    <tr key={props.address}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <AddressIdenticon address={props.address} height={32} width={32} />
      </td>
      <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-500">
        <Link href={`/addr/${props.address}`}>
          <a className="cursor-pointer hover:text-indigo-500">
            {ens || props.address} 
          </a>
        </Link>
      </td>
    </tr>
  );
}
