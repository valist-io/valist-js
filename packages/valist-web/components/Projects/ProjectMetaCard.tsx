import React, { useEffect, useState } from 'react';
import { ProjectMeta } from '../../utils/Apollo/types';
import ProjectActions from './ProjectActions';

interface RepoMetaCardProps {
  releaseMeta: any,
  teamName: string,
  projectName: string
}

const ProjectMetaCard = (props: RepoMetaCardProps) => {
  const {
    releaseMeta, teamName, projectName,
  } = props;

  const [downloads, setDownloads] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const downloads = await fetch("http://stats.valist.io/api/downloads?package=test");
        const json = await downloads.json();
        setDownloads(json.downloads)
      } catch (err) {}
    })()
  }, []);

  return (
    <div className="rounded-lg bg-white shadow p-6">
      <ProjectActions
        teamName={teamName}
        projectName={projectName}
        showAll={false} />
      <div className="grid grid-cols-2 gap-2">
      {releaseMeta.license 
        && <div className="pb-4">
            <h1 className="text-xl text-gray-900 mb-1">License</h1>
            <div className="text-gray-600">
              {releaseMeta.license}
            </div>
          </div>}
          
        <div className="pb-4">
          <h1 className="text-xl text-gray-900 mb-1">Downloads</h1>
          <div className="text-gray-600">{downloads}</div>
        </div>

        {releaseMeta.version
          && <div className="pb-4">
            <h1 className="text-xl text-gray-900 mb-1">Version</h1>
            <div className="text-gray-600">{releaseMeta.version}</div>
          </div>}

        <div className="pb-4">
          <h1 className="text-xl text-gray-900 mb-1">Total Files</h1>
          <div className="text-gray-600">{Object.keys(releaseMeta.artifacts).length}</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMetaCard;
