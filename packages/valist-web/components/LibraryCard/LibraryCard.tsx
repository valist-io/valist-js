import { useState, useContext, useEffect } from 'react';
import { Stack, Group } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { ProjectCard, Button } from '@valist/ui';
import { Metadata } from '@/components/Metadata';
import { SapphireContext } from '@/components/SapphireProvider';
import { useValist } from '@/utils/valist';

export interface LibraryCardProps {
  id: string;
  name: string;
  metaURI: string;
  href: string;
  installed: string;
}

export function LibraryCard(props: LibraryCardProps) {
  const sapphire = useContext(SapphireContext);
  const valist = useValist();

  const [latest, setLatest] = useState('');

  useEffect(() => {
    valist.getLatestReleaseID(props.id)
      .then(id => setLatest(id.toHexString()));
  }, [props.id]);

  return (
    <Stack>
      <Metadata url={props.metaURI}>
        {(data: any) =>
          <NextLink
            style={{ textDecoration: 'none' }}
            href={props.href}
          >
            <ProjectCard
              title={props.name} 
              secondary={data?.name}
              description={data?.description} 
              image={data?.image} 
            />
          </NextLink>
        }
      </Metadata>
      <Group noWrap>
        { props.installed &&
          <Button 
            variant="secondary" 
            onClick={() => sapphire.uninstall(props.installed)}
          >
            Uninstall
          </Button> 
        }
        { (props.installed && latest !== props.installed) &&
          <Button 
            variant="secondary"
            onClick={() => console.log('TODO')}
          >
            Update
          </Button> 
        }
        { (props.installed && latest === props.installed) &&
          <Button 
            variant="primary"
            onClick={() => sapphire.launch(props.installed)}
          >
            Launch
          </Button> 
        }
        { !props.installed && 
          <Button 
            variant="primary"
            onClick={() => sapphire.install(latest)}
          >
            Install
          </Button> 
        }
      </Group>
    </Stack>
  );
}