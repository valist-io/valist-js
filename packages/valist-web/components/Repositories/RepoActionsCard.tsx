import { ProjectType } from '@valist/sdk/dist/types';
import RepoActions from './RepoActions';

interface RepoActionsCardProps {
  orgName: string,
  repoName: string,
  projectType: ProjectType,
  showAll: boolean,
}

export default function RepoActionsCard(props: RepoActionsCardProps): JSX.Element {
  return (
    <div className="p-8">
      <RepoActions
        orgName={props.orgName}
        repoName={props.repoName}
        projectType={props.projectType}
        showAll={props.showAll}
      />
    </div>
  );
}
