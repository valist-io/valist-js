import ProjectMemberList from './ProjectMemberList';
import ReleaseList from '../releases/ReleaseList';
import ProjectReadme from './ProjectReadme';
import PublishReleaseSteps from '../releases/PublishReleaseSteps';
import LogTable from '../logs/LogTable';
import { Log, Member, Release } from '../../utils/Apollo/types';
import { ProjectMeta, ReleaseMeta } from '../../utils/Valist/types';
import { Fragment } from 'react';
import ProjectGallery from './ProjectGallery';

interface ProjectContentProps {
  teamName: string,
  projectName: string,
  projectReleases: Release[]
  projectMeta: ProjectMeta,
  releaseMeta: ReleaseMeta,
  view: string,
  members: Member[],
  logs: Log[],
}

export default function ProjectContent(props: ProjectContentProps): JSX.Element {
  const getRepoView = (view: string) => {
    let currentView = view;
    if (view === 'versions' && props.projectReleases.length === 0) {
      currentView = 'releaseSteps';
    }

    const isGallery = props?.projectMeta?.gallery !== undefined && props?.projectMeta?.gallery.length !== 0;

    switch (currentView) {
      case 'Readme':
        return (
          <Fragment>
            {(props?.projectMeta?.gallery && props?.projectMeta?.gallery.length !== 0) && 
              <ProjectGallery assets={props?.projectMeta?.gallery} />
            }
            <div className={isGallery ? 'mt-4' : ''}>
              <ProjectReadme repoReadme={props?.projectMeta?.description || ''} />
            </div>
          </Fragment>
        );
      case 'Members':
        return (<ProjectMemberList members={props?.members} />);
      case 'Versions':
        return (<ReleaseList
          projectReleases={props.projectReleases}
          teamName={props.teamName}
          projectName={props.projectName}
        />);
      case 'ReleaseSteps':
        return <PublishReleaseSteps />;
      case 'Activity':
        return <LogTable logs={props.logs} />;
      default:
        return <Fragment />;
    }
  };

  return (
    <section className="rounded-lg min-h-40">
      <div className="lg:min-w-0 lg:flex-1">
        {getRepoView(props.view)}
      </div>
    </section>
  );
}
