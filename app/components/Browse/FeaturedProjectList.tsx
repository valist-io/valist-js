import ProjectListItem from './ProjectListItem';

interface FeaturedProjectListProps {
  projects: any[]
}

export default function FeaturedProjectList(props: FeaturedProjectListProps) {
  return (
    <section>
      <div className="rounded-lg overflow-hidden">
        <div className="pb-4 px-48">
          {props.projects.map((project) => (
            <ProjectListItem project={project} key={project.path}/>
          ))}
        </div>
      </div>
    </section>
  );
}
