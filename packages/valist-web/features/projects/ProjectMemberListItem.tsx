import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import Web3Context from "../valist/Web3Context";
import Link from "next/link";
import { useContext, useEffect, useState } from 'react';
import { TrashIcon } from '@heroicons/react/outline';

interface ProjectMemberListItemProps {
  address: string
  removeMember?: (address: string) => void;
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
      <td>
        <AddressIdenticon address={props.address} height={32} width={32} />
      </td>
      <td>
        <Link href={`/addr/${props.address}`}>
          <a className="cursor-pointer hover:text-indigo-500">
            {ens || props.address} 
          </a>
        </Link>
        {props.removeMember && 
          <TrashIcon
            height={20} width={20} 
            onClick={() => {props.removeMember && props.removeMember(props.address);}} 
          />
        }
      </td>
    </tr>
  );
}
