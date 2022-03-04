import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { ProjectMeta } from '../../utils/Valist/types';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import ValistContext from '../Valist/ValistContext';
import removeMd from 'remove-markdown';
import AccountContext from '../Accounts/AccountContext';

type ProjectCardProps = {
  teamName: string,
  projectName: string,
  metaURI: string,
};

export default function ProjectListCard({ teamName, projectName, metaURI }: ProjectCardProps): JSX.Element {
  const name = `${teamName}/${projectName}`;
  const valistCtx = useContext(ValistContext);
  const accountCtx = useContext(AccountContext);
  let [ meta, setMeta ] = useState<ProjectMeta>({
    image: '',
    description: "Loading....",
  });

  useEffect(() => {
    const fetchProjectMeta = async (metaURI: string) => {
      try {
        const projectJson = await valistCtx.valist.storage.readReleaseMeta(metaURI);
        setMeta(projectJson);
      } catch (err) {
        console.log("Failed to fetch project JSON.", err);
        accountCtx.notify('error', String(err));
      }
    };

    fetchProjectMeta(metaURI);
  }, [accountCtx, metaURI, valistCtx.valist.storage]);

  return (
    <div className="bg-white rounded-lg shadow px-6 py-6 mb-2 border-2 hover:border-indigo-500 cursor-pointer">
      <div className='flex mb-3'>
        <div className="flex-shrink-0 mr-5">
          {meta.image ?
            <Image height={50} width={50} className='rounded-full'
            src={meta.image} alt="Profile Pic" />      
            :
            <AddressIdenticon address={name} height={50} width={50} />
          }
        </div>

        <div>
          <h3 className="text-xl">
            {projectName}
          </h3>
          <div>Published by: 
            <span className="ml-1 cursor-pointer text-gray-900 py-1">
              <span style={{ marginBottom: "-4px" }} className='inline-block'></span>
                {teamName}
              </span>
          </div>
        </div>
      </div>
     
      <div>
        <p style={{ height: 48, maxHeight: 48, overflow: 'hidden' }}>
          {removeMd(meta.description || '')}
        </p>
      </div>
    </div>
  );
};