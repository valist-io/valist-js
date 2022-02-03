import React from 'react';
import { TeamMeta } from '../../utils/Valist/types';
interface TeamMetaCardProps {
  teamMeta: TeamMeta,
}

export default function TeamMetaCard(props: TeamMetaCardProps) {
  const { teamMeta } = props;

  return (
    <div className="rounded-lg bg-white shadow p-6">
      {teamMeta?.external_url && 
        <div className="pb-4">
          <h1 className="text-xl text-gray-900  mb-1">Website</h1>
          <a className="text-gray-600 hover:text-indigo-500" href={teamMeta?.external_url}>{teamMeta?.external_url}</a>
        </div>
      }
    </div>
  );
};