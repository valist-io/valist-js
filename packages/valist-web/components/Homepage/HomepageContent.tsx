import { Project } from '../../utils/Apollo/types';
import LicenseList from '../Licenses/LicenseList';
import ProjectList from '../Projects/ProjectList';

interface ReleaseListProps {
  userProjects: Project[]
  view: string,
}

export default function HomepageContent(props: ReleaseListProps): JSX.Element {
  const getHoempageView = (view: string) => {
    switch (view) {
      case 'Projects':
        return <ProjectList linksDisabled={false} projects={props.userProjects}/>
      case 'Teams':
        return <div></div>
      case 'Licenses':
        return <LicenseList />
      default:
        return <ProjectList linksDisabled={false} projects={props.userProjects}/>
    }
  };

  return (
    <section>
      {getHoempageView(props.view)}
    </section>
  );
}
