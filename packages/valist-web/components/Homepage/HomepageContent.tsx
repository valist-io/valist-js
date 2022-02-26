import { Project } from '../../utils/Apollo/types';
import LicenseList from '../Licenses/LicenseList';
import LogTable from '../Logs/LogTable';
import ProjectList from '../Projects/ProjectList';

interface ReleaseListProps {
  userProjects: Project[]
  address: string,
  view: string,
}

export default function HomepageContent(props: ReleaseListProps): JSX.Element {
  const getHoempageView = (view: string) => {
    switch (view) {
      case 'Projects':
        return <ProjectList linksDisabled={false} projects={props.userProjects}/>;
      case 'Teams':
        return <div></div>;
      case 'Activity':
        return <LogTable  address={props.address} />;
      case 'Licenses':
        return <LicenseList />;
      default:
        return <ProjectList linksDisabled={false} projects={props.userProjects}/>;
    }
  };

  return (
    <section>
      {getHoempageView(props.view)}
    </section>
  );
}
