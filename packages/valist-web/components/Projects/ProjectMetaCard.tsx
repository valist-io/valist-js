import React, { useEffect, useState } from 'react';
import { ProjectMeta, ReleaseMeta } from '../../utils/Valist/types';
import ProjectActions from './ProjectActions';

interface RepoMetaCardProps {
  version?: string,
  teamName: string,
  projectName: string
  projectMeta: ProjectMeta,
  releaseMeta: ReleaseMeta,
}

const ProjectMetaCard = (props: RepoMetaCardProps) => {
  const {
   teamName, projectName, projectMeta, releaseMeta 
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
    })()
  }, []);

  return (
    <div className="rounded-lg bg-white shadow p-6">
      <ProjectActions
        teamName={teamName}
        projectName={projectName}
        showAll={false} 
      />
      {projectMeta.external_url
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900  mb-1">Website</h1>
          <a className="text-gray-600 hover:text-indigo-500" href={projectMeta.external_url}>
            {projectMeta.external_url}
          </a>
        </div>
      }
      <div className="grid grid-cols-2 gap-2">
        <div className="pb-4">
          <h1 className="text-xl text-gray-900 mb-1">Downloads</h1>
          <div className="text-gray-600">{downloads}</div>
        </div>

        {props.version &&
          <div className="pb-4">
            <h1 className="text-xl text-gray-900 mb-1">Version</h1>
            <div className="text-gray-600">{props.version}</div>
          </div>}
          
        <div className="pb-4">
          <h1 className="text-xl text-gray-900 mb-1">Total Files</h1>
          <div className="text-gray-600">
            {releaseMeta.artifacts?.size || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMetaCard;
