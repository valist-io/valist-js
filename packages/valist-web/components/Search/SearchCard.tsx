import React, { useEffect, useState } from 'react';
import { fetchJSONfromIPFS } from '../../utils/Ipfs';
import AddressIdenticon from '../Identicons/AddressIdenticon';

type SearchCardProps = {
  name: string,
  metaCID: string,
};

type ProjectMeta = {
  description: string,
}

export default function SearchCard(props: SearchCardProps): JSX.Element {
  let [ meta, setMeta ] = useState<ProjectMeta>({
    description: "Loading....",
  });

  useEffect(() => {
    fetchJSONfromIPFS(props.metaCID).then((metaJson) => {
      setMeta(JSON.parse(metaJson));
    });
  }, [props.metaCID]);
  
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-md flex hover:border-indigo-300">
      <div className="flex-shrink-0 mr-10">
        <AddressIdenticon address={props.name} height={56} />
      </div>
      <div>
        <h3 className="text-xl">
          {props.name}
        </h3>
        <p>
          {meta.description}
        </p>
      </div>
    </div>
  )
};