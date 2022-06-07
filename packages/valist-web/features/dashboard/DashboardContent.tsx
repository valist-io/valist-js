import { Log, Project } from '../../utils/Apollo/types';
import LogTable from '../logs/LogTable';
import ProjectList from '../projects/ProjectList';
import EmptyProjectList from '../projects/EmptyProjects';
import EmptyTeams from '../accounts/EmptyAccounts';

interface DashboardContentProps {
  accountName: string;
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
        return <EmptyProjectList accountName={props.accountName} />;
      case 'Projects':
        return <ProjectList linksDisabled={false} projects={props.userProjects} />;
      case 'Activity':
        return <div style={{ marginTop: "1rem" }}><LogTable logs={props.logs} /></div>;
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
