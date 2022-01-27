import ProjectMemberList from './ProjectMemberList';
import ReleaseList from '../Releases/ReleaseList';
import RepoReadme from './ProjectReadme';
import PublishReleaseSteps from '../Releases/PublishReleaseSteps';
import RepoDependencies from './ProjectDependencies';
import { Release, ReleaseMeta, Key } from '../../utils/Apollo/types';

interface ReleaseListProps {
  teamName: string,
  projectName: string,
  projectReleases: Release[]
  releaseMeta: ReleaseMeta,
  view: string,
  members: Key[],
}

export default function RepoContent(props: ReleaseListProps): JSX.Element {
  const getRepoView = (view: string) => {
    let currentView = view;
    if (view === 'versions' && props.projectReleases.length === 0) {
      currentView = 'releaseSteps';
    }

    switch (currentView) {
      case 'Readme':
        return <RepoReadme repoReadme={props.releaseMeta.readme} />;
      case 'Members':
        return (<ProjectMemberList members={props.members} />);
      case 'Versions':
        return (<ReleaseList
          repoReleases={props.projectReleases}
          orgName={props.teamName}
          repoName={props.projectName}
        />);
      case 'Dependencies':
        return <RepoDependencies releaseMeta={props.releaseMeta} />;
      case 'ReleaseSteps':
        return <PublishReleaseSteps />;
      default:
        return <RepoReadme repoReadme={props.releaseMeta.readme} />;
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
