import ProjectMemberList from '../Projects/ProjectMemberList';
import RepoReadme from '../Projects/ProjectReadme';
import { Member } from '../../utils/Apollo/types';

interface RepoContentProps {
  view: string,
  teamName: string,
  description: string,
  members: Member[]
}

export default function RepoContent(props: RepoContentProps): JSX.Element {
  const getRepoView = (view: string) => {
    switch (view) {
      case 'Readme':
        return <RepoReadme repoReadme={props.description} />;
      case 'Members':
        return <ProjectMemberList members={props.members} />;
      default:
        return <RepoReadme repoReadme={props.description} />;
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
