import { Project } from '../../utils/Apollo/types';
import { License } from '../../utils/Valist/types';
import LicenseList from '../Licenses/LicenseList';
import LogTable from '../Logs/LogTable';
import ProjectList from '../Projects/ProjectList';
import EmptyProjectList from '../Projects/EmptyProjects';
import EmptyTeams from '../Teams/EmptyTeams';

interface ReleaseListProps {
  userProjects: Project[]
  userLicenses: License[],
  address: string,
  view: string,
}

export default function HomepageContent(props: ReleaseListProps): JSX.Element {
  const getHomepageView = (view: string) => {
    switch (view) {
      case "EmptyTeams": 
        return <EmptyTeams />;
      case 'EmptyProjects':
        return <EmptyProjectList />;
      case 'Projects':
        return <ProjectList linksDisabled={false} projects={props.userProjects} />;
      case 'Activity':
        return <LogTable  address={props.address} />;
      case 'Licenses':
        return <LicenseList licenses={props.userLicenses} />;
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
