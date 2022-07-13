import { ProjectCard as ProjectCardUI } from '@valist/ui';
import useSWRImmutable from 'swr/immutable';

export interface ProjectCardProps {
  name: string;
  metaURI: string;
}

export function ProjectCard(props: ProjectCardProps) {
  const { data } = useSWRImmutable(props.metaURI);
  return (
    <ProjectCardUI
      title={props.name}
      image={data?.image}
      secondary={data?.name}
      description={data?.description}
    />
  );
}