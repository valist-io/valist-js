import { useContext, useEffect, useState } from 'react';
import ProjectListItem from '../../components/Browse/ProjectListItem';
import ValistContext from '../../components/Valist/ValistContext';

interface FullProjectListProps {
  number: number
}

export default function FullProjectList(props:FullProjectListProps) {
  const valist = useContext(ValistContext);
  const [projectList, setProjectList]:any = useState([
    {
      path: 'Loading/Loading',
    },
  ]);

  const getRepos = async () => {
    const projects:any = [];
    try {
      console.log('Internal Page', props.number);
      const orgs = await valist.getOrganizationNames(1, props.number);
      // eslint-disable-next-line no-restricted-syntax
      for (const orgName of orgs) {
        // eslint-disable-next-line no-await-in-loop
        const org = await valist.getOrganization(orgName);
        // eslint-disable-next-line no-restricted-syntax
        for (const project of org.repoNames) {
          projects.push({
            path: `${orgName}/${project}`,
          });
        }
      }
      return projects;
    } catch (err) {
      console.log(err);
    }

    return [];
  };

  useEffect(() => {
    (async () => {
      const repos = await getRepos();
      setProjectList(repos);
    })();
  }, [props.number]);

  return (
    <section>
      <div className="rounded-lg overflow-hidden">
        <div className="pb-4 px-48">
          {projectList.map((project: any) => (
            <ProjectListItem project={project} key={project.path}/>
          ))}
        </div>
      </div>
    </section>
  );
}
