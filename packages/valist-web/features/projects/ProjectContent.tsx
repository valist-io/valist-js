import ProjectMemberList from './ProjectMemberList';
import ReleaseList from '../../features/releases/ReleaseList';
import ProjectReadme from './ProjectReadme';
import PublishReleaseSteps from '../../features/releases/PublishReleaseSteps';
import LogTable from '../logs/LogTable';
import { Member, Release } from '../../utils/Apollo/types';
import { ProjectMeta, ReleaseMeta } from '../../utils/Valist/types';

interface ProjectContentProps {
  teamName: string,
  projectName: string,
  projectReleases: Release[]
  projectMeta: ProjectMeta,
  releaseMeta: ReleaseMeta,
  view: string,
  members: Member[],
}

export default function ProjectContent(props: ProjectContentProps): JSX.Element {
  const getRepoView = (view: string) => {
    let currentView = view;
    if (view === 'versions' && props.projectReleases.length === 0) {
      currentView = 'releaseSteps';
    }

    switch (currentView) {
      case 'Readme':
        return <ProjectReadme repoReadme={props?.projectMeta?.description || ''} />;
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
        return <LogTable team={props.teamName} project={props.projectName} />;
      default:
        return <ProjectReadme repoReadme={props.projectMeta.description || ''} />;
    }
  };

  return (
    <section className="rounded-lg bg-white shadow ">
      <div className="bg-white lg:min-w-0 lg:flex-1">
        {getRepoView(props.view)}
      </div>
    </section>
  );
}
