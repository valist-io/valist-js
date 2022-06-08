import { Paper } from '@mantine/core';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SetUseState } from '../../utils/Account/types';
import { ProjectMeta, ReleaseMeta } from '../../utils/Valist/types';

interface RepoMetaCardProps {
  version?: string;
  teamName: string;
  projectName: string;
  memberCount: number;
  projectMeta: ProjectMeta;
  donate: SetUseState<boolean>;
}

const ProjectMetaCard = (props: RepoMetaCardProps) => {
  const {
   teamName, projectName, projectMeta, 
  } = props;

  const [downloads, setDownloads] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        if (teamName && projectName) {
          const downloads = await fetch(`https://stats.valist.io/api/downloads/${teamName}/${projectName}`);
          const json = await downloads.json();
          setDownloads(json.downloads);
        }
      } catch (err) { /* @TODO HANDLE */}
    })();
  }, [projectName, teamName]);

  return (
    <Paper shadow="xs" p="md" radius="md" withBorder>
      {projectMeta.external_url && 
        <div className="pb-3">
          <h3 className="text-lg mb-1">Website</h3>
          <a className="hover:text-indigo-500" href={projectMeta.external_url}>
            {projectMeta.external_url}
          </a>
        </div>}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <h3 className="text-lg mb-1">Downloads</h3>
          <div>{downloads}</div>
        </div>

        <div>
          <h3 className="text-lg mb-1">Members</h3>
          <div>
            {props.memberCount || 0}
          </div>
        </div>
        
        {props.version &&
          <div>
            <h3 className="text-lg mb-1">Version</h3>
            <div>{props.version}</div>
          </div>}

        <div>
          <h3 className="text-lg mb-1">Published by</h3>
          <Link href={`/${teamName}`}>
            <a className="hover:text-indigo-500">{teamName}</a>
          </Link>
        </div>
      </div>
    </Paper>
  );
};

export default ProjectMetaCard;
