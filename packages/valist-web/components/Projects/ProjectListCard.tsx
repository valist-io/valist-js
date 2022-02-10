import React, { useContext, useEffect, useState } from 'react';
import { parseCID } from '../../utils/Ipfs';
import { ProjectMeta } from '../../utils/Valist/types';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import ValistContext from '../Valist/ValistContext';

type ProjectCardProps = {
  teamName: string,
  projectName: string,
  metaURI: string,
};

export default function ProjectListCard({ teamName, projectName, metaURI }: ProjectCardProps): JSX.Element {
  const name = `${teamName}/${projectName}`;
  const valistCtx = useContext(ValistContext);
  let [ meta, setMeta ] = useState<ProjectMeta>({
    image: '',
    description: "Loading....",
  });

  const fetchProjectMeta = async (metaURI: string) => {
    try {
      const projectJson = await valistCtx.valist.storage.readReleaseMeta(metaURI);
      setMeta(projectJson)
    } catch (err) {
      // @TODO HANDLE
      console.log()
    }
  };

  useEffect(() => {
    fetchProjectMeta(metaURI);
  }, [metaURI]);

  return (
    <div className="bg-white rounded-lg shadow px-6 py-6 mb-2 flex items-center justify-start border-2 hover:border-indigo-500">
      <div className="mr-7">
        
      </div>
      <div className="">
        <h3 className="text-xl">
          {projectName}
        </h3>
        <div>Published by: 
          <span className="ml-1 cursor-pointer text-gray-900 py-1">
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