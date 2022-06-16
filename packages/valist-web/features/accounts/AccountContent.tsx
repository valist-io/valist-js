import { Member, Project } from '../../utils/Apollo/types';
import ProjectMemberList from '../projects/ProjectMemberList';
import ProjectList from './AccountProjectList';

interface TeamContentProps {
  view: string,
  username: string,
  description: string,
  members: Member[]
}

export default function TeamContent(props: TeamContentProps): JSX.Element {
  const demoProjects:Project[] = [
    {
      id: "test1",
      name: "project1",
      metaURI: "https://gateway.valist.io/ipfs/QmWgnkpxbyzSA97Kmzdkm87z4XZKMjPwWbwovGz3raVwRt",
      account: {
        name: props.username,
      },
      releases:[],
    },
    {
      id: "test2",
      name: "project2",
      metaURI: "https://gateway.valist.io/ipfs/QmWgnkpxbyzSA97Kmzdkm87z4XZKMjPwWbwovGz3raVwRt",
      account: {
        name: props.username,
      },
      releases:[],
    },
    {
      id: "test3",
      name: "project3",
      metaURI: "https://gateway.valist.io/ipfs/QmWgnkpxbyzSA97Kmzdkm87z4XZKMjPwWbwovGz3raVwRt",
      account: {
        name: props.username,
      },
      releases:[],
    },
    {
      id: "test4",
      name: "project4",
      metaURI: "https://gateway.valist.io/ipfs/QmWgnkpxbyzSA97Kmzdkm87z4XZKMjPwWbwovGz3raVwRt",
      account: {
        name: props.username,
      },
      releases:[],
    },
  ];

  const getTeamView = (view: string) => {
    switch (view) {
      case 'Projects':
        return <ProjectList projects={demoProjects} linksDisabled={true} />;
      case 'Members':
        return <ProjectMemberList members={props.members} />;
      default:
        return <ProjectList projects={demoProjects} linksDisabled={true} />;
    }
  };

  return (
    <section className="rounded-lg">
      <div className="lg:min-w-0 lg:flex-1">
        <div className="xl:border-t-0">
          {getTeamView(props.view)}
        </div>
      </div>
    </section>
  );
}
