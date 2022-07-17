import {
  ProjectCard as ProjectCardUI
} from '@valist/ui';

import { Metadata } from '@/components/Metadata';

export interface ProjectCardProps {
  name: string;
  metaURI: string;
}

export function ProjectCard(props: ProjectCardProps) {
  return (
    <Metadata url={props.metaURI}>
      {(data: any) => 
        <ProjectCardUI
          title={props.name} 
          secondary={data?.name}
          description={data?.description} 
          image={data?.image} /> 
      }
    </Metadata>
  );
}