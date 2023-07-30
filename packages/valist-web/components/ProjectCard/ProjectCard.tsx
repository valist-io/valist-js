import { ProjectCard as Card } from '@valist/ui';
import { Metadata } from '@/components/Metadata';
import Link from 'next/link';

export interface ProjectCardProps {
  name: string;
  metaURI: string;
  href: string;
}

export function ProjectCard(props: ProjectCardProps) {
  return (
    <Metadata url={props.metaURI}>
      {(data: any) =>
        <Link
          style={{ textDecoration: 'none' }}
          href={props.href}
          passHref
        >
          <Card
            title={props.name} 
            secondary={data?.name}
            description={data?.short_description} 
            image={data?.image} 
          />
        </Link>
      }
    </Metadata>
  );
}