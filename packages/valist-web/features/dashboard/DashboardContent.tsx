import { Log, Project } from '../../utils/Apollo/types';
import LogTable from '../logs/LogTable';
import ProjectList from '../projects/ProjectList';
import EmptyProjectList from '../projects/EmptyProjects';
import EmptyTeams from '../accounts/EmptyAccounts';

interface DashboardContentProps {
  userProjects: Project[]
  logs: Log[];
  address: string,
  view: string,
}

export default function DahsboardContent(props: DashboardContentProps): JSX.Element {
  const getHomepageView = (view: string) => {
    switch (view) {
      case "EmptyTeams": 
        return <EmptyTeams />;
      case 'EmptyProjects':
        return <EmptyProjectList />;
      case 'Projects':
        return <ProjectList linksDisabled={false} projects={props.userProjects} />;
      case 'Activity':
        return <LogTable logs={props.logs} />;
      default:
        return <EmptyTeams />;
    }
  };

  return (
    <section>
      {getHomepageView(props.view)}
    </section>
  );
}
