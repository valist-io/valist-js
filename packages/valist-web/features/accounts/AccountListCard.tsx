/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import { notify } from '../../utils/Notifications';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';
import { AccountMeta } from '@valist/sdk';
import { Paper } from '@mantine/core';

type TeamListCardProps = {
  text?: string;
  image?: string;
  teamName: string;
  metaURI: string;
};

export default function TeamListCard({ text, image, teamName, metaURI }: TeamListCardProps): JSX.Element {
  let [ meta, setMeta ] = useState<AccountMeta>({
    image: '',
  });

  useEffect(() => {
    const fetchTeamMeta = async (metaURI: string) => {
      if (metaURI !== '' || metaURI !== undefined) {
        try {
          const teamJson = await fetch(metaURI).then(res => res.json());
          setMeta(teamJson);
        } catch (err) {
          console.log("Failed to fetch team metadata.", err);
          console.log(metaURI);
          notify('error', String(err));
        }
      }
    };

    if (!text) {
      fetchTeamMeta(metaURI);
    }
  }, [metaURI, text]);

  return (
    <Paper style={{ height: '116px' }} shadow="xs" p="md" radius="md" withBorder>
      <div className='flex mb-3'>
        <div className="flex-shrink-0 mr-5">
          {(image || meta.image) ?
            <div className="flex-shrink-0 mx-auto rounded-full overflow-hidden" style={{ height: 50, width: 50 }} >
              <img className='rounded-full' src={image || meta.image} alt="Profile Pic" /> 
            </div>
            :
            <AddressIdenticon address={teamName} height={50} width={50} />
          }
        </div>

        <div>
          <h3 className="text-xl">
            {teamName}
          </h3>
          <p style={{ overflow: 'hidden' }}>
            {text || meta.description}
          </p>
        </div>
      </div>
    </Paper>
  );
};