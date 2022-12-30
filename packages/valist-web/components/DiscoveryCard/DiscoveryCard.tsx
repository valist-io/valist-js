import { 
  Anchor,
  Group,
  Paper,
  Stack,
  Title,
  Text,
} from '@mantine/core';

import { Tag } from '@valist/ui';
import Image from 'next/image';

export interface DiscoveryCardProps {
  image?: string;
  name?: string;
  description?: string;
  type?: string;
  link?: string;
}

export function DiscoveryCard(props: DiscoveryCardProps) {
  return (
    <Anchor href={props.link ?? '/'} style={{ textDecoration: 'none' }}>
      <Stack style={{ maxWidth: 350 }}>
        <div style={{ borderRadius: 8 }}>
          <Image
            style={{ borderRadius: 8 }}
            src={props.image ?? '/images/valist.png'}
            alt={props.name} 
            width={264}
            height={185}
            objectFit="contain"
            objectPosition="center"
          />
        </div>
        <Title size={18} style={{ height: 24 }}>
          {props.name}
        </Title>
        <Text size={12} lineClamp={2} style={{ height: 38 }}>
          {props.description}
        </Text>
        <div>
          <Tag label={props.type || 'Unknown'} />
        </div>
      </Stack>
    </Anchor>
  );
}