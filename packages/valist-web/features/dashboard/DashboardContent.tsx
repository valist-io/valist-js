import { Project } from '../../utils/Apollo/types';
import { License } from '../../utils/Valist/types';
import LicenseList from '../licenses/LicenseList';
import LogTable from '../logs/LogTable';
import ProjectList from '../projects/ProjectList';
import EmptyProjectList from '../projects/EmptyProjects';
import EmptyTeams from '../teams/EmptyTeams';

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
