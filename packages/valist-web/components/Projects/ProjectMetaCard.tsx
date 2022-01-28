import React, { useEffect, useState } from 'react';
import { ProjectMeta } from '../../utils/Apollo/types';
import ProjectActions from './ProjectActions';

interface RepoMetaCardProps {
  teamName: string,
  projectName: string
  projectMeta: ProjectMeta,
  releaseMeta: any,
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
          const downloads = await fetch(`https://stats.valist.io/api/downloads/?package=${teamName}/${projectName}`);
          const json = await downloads.json();
          setDownloads(json.downloads);
        }
      } catch (err) {}
    })()
  }, []);

  return (
    <div className="rounded-lg bg-white shadow p-6">
      <ProjectActions
        teamName={teamName}
        projectName={projectName}
        showAll={false} 
      />
      {projectMeta.homepage
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900  mb-1">Homepage</h1>
          <a className="text-gray-600 hover:text-indigo-500" href={projectMeta.homepage}>{projectMeta.homepage}</a>
        </div>
      }
      {projectMeta.repository
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900  mb-1">Repository</h1>
          <a className="text-gray-600 hover:text-indigo-500" href={projectMeta.repository}>{projectMeta.repository}</a>
        </div>
      }
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
