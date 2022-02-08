import ProjectMemberList from './ProjectMemberList';
import ReleaseList from '../Releases/ReleaseList';
import RepoReadme from './ProjectReadme';
import PublishReleaseSteps from '../Releases/PublishReleaseSteps';
import { Member, Release } from '../../utils/Apollo/types';
import { ReleaseMeta } from '../../utils/Valist/types';
import LogTable from '../../components/Logs/LogTable';

interface ReleaseListProps {
  teamName: string,
  projectName: string,
  projectReleases: Release[]
  releaseMeta: ReleaseMeta,
  view: string,
  members: Member[],
}

export default function RepoContent(props: ReleaseListProps): JSX.Element {
  const getRepoView = (view: string) => {
    let currentView = view;
    if (view === 'versions' && props.projectReleases.length === 0) {
      currentView = 'releaseSteps';
    }

    switch (currentView) {
      case 'Readme':
        return <RepoReadme repoReadme={props.releaseMeta.description} />;
      case 'Members':
        return (<ProjectMemberList members={props.members} />);
      case 'Versions':
        return (<ReleaseList
          projectReleases={props.projectReleases}
          teamName={props.teamName}
          projectName={props.projectName}
        />);
      case 'ReleaseSteps':
        return <PublishReleaseSteps />;
      case 'Logs':
        return <LogTable team={props.teamName} project={props.projectName} />
      default:
        return <RepoReadme repoReadme={props.releaseMeta.description} />;
    }
  };

  return (
    <section className="rounded-lg bg-white shadow ">
      <div className="bg-white lg:min-w-0 lg:flex-1">
        <div className="border-b border-t border-gray-200 xl:border-t-0">
          {getRepoView(props.view)}
        </div>
      </div>
    </section>
  );
}
