import { NextLink } from '@mantine/next';
import { ProjectCard as Card } from '@valist/ui';
import { Metadata } from '@/components/Metadata';

export interface ProjectCardProps {
  name: string;
  metaURI: string;
  href: string;
}

export function ProjectCard(props: ProjectCardProps) {
  return (
    <Metadata url={props.metaURI}>
      {(data: any) =>
        <NextLink
          style={{ textDecoration: 'none' }}
          href={props.href}
        >
          <Card
            title={props.name} 
            secondary={data?.name}
            description={data?.short_description} 
            image={data?.image} 
          />
        </NextLink>
      }
    </Metadata>
  );
}