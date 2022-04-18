/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { notify } from '../../utils/Notifications';
import { ProjectMeta } from '../../utils/Valist/types';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';

type ProjectCardProps = {
  teamName: string,
  projectName: string,
  metaURI: string,
  text?: string,
  image?: string,
};

export default function ProjectListCard({ text, image, teamName, projectName, metaURI }: ProjectCardProps): JSX.Element {
  const name = `${teamName}/${projectName}`;
  let [ meta, setMeta ] = useState<ProjectMeta>({
    image: image || '',
    short_description: "Loading....",
  });

  useEffect(() => {
    if (!text) {
      const fetchProjectMeta = async (metaURI: string) => {
        try {
          const projectJson = await fetch(metaURI).then(res => res.json());
          setMeta(projectJson);
        } catch (err) {
          console.log("Failed to fetch project metadata.", err);
          console.log(metaURI);
          notify('error', String(err));
        }
      };
      fetchProjectMeta(metaURI);
    }
  }, [metaURI, text]);

  return (
    <div className="bg-white rounded-lg shadow px-6 py-6 mb-2 border-2 hover:border-indigo-500 cursor-pointer">
      <div className='flex mb-3'>
        <div className="flex-shrink-0 mr-5">
          {meta.image ?
              <div className="flex-shrink-0 mx-auto rounded-full overflow-hidden" style={{ height: 50, width: 50 }} >
                <img className='rounded-full' src={meta.image} alt="Profile Pic" /> 
              </div>      
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
          {text || meta.short_description}
        </p>
      </div>
    </div>
  );
};