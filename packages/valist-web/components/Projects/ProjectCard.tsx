import React, { useEffect, useState } from 'react';
import { fetchJSONfromIPFS, parseCID } from '../../utils/Ipfs';
import AddressIdenticon from '../Identicons/AddressIdenticon';

type ProjectCardProps = {
  teamName: string,
  projectName: string,
  metaCID: string,
};

type ProjectMeta = {
  description: string,
}

const ProjectCard = ({ teamName, projectName, metaCID }: ProjectCardProps): JSX.Element => {
  let [ meta, setMeta ] = useState<ProjectMeta>({
    description: "Loading....",
  });

  useEffect(() => {
    fetchJSONfromIPFS(metaCID).then((metaJson) => {
      setMeta(JSON.parse(metaJson));
    });
  }, [metaCID]);

  const name = `${teamName}/${projectName}`;
  
  return (
    <div className="bg-white rounded-lg shadow px-8 py-6 mb-2 flex items-center justify-start">
      <div className="mr-7">
          <AddressIdenticon address={name} height={80} />
      </div>
      <div className="">
        <h3 className="text-xl">
          {name}
        </h3>
            <div>Published by: 
              <span className="ml-1 hover:text-indigo-500 cursor-pointer text-gray-900 py-1">
                <span style={{marginBottom: "-4px"}} className='inline-block'></span>
                {teamName}
              </span>
            </div>
        <p>
          {meta.description}
        </p>
      </div>
    </div>
  )
};

export default ProjectCard;