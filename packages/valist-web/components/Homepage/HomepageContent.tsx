import { Project } from '../../utils/Apollo/types';
import { License } from '../../utils/Valist/types';
import LicenseList from '../Licenses/LicenseList';
import LogTable from '../Logs/LogTable';
import ProjectList from '../Projects/ProjectList';

interface ReleaseListProps {
  userProjects: Project[]
  userTeams: Project[]
  userLicenses: License[],
  address: string,
  view: string,
}

export default function HomepageContent(props: ReleaseListProps): JSX.Element {
  const getHomepageView = (view: string) => {
    switch (view) {
      case 'Projects':
        return <ProjectList linksDisabled={false} projects={props.userProjects}/>;
      case 'Activity':
        return <LogTable  address={props.address} />;
      case 'Licenses':
        return <LicenseList licenses={props.userLicenses} />;
      default:
        return <ProjectList linksDisabled={false} projects={props.userProjects}/>;
    }
  };

  return (
    <section>
      {getHomepageView(props.view)}
    </section>
  );
}
