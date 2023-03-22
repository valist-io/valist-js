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
import { useState } from 'react';

export interface DiscoveryCardProps {
  image?: string;
  name?: string;
  description?: string;
  type?: string;
  link?: string;
}

export function DiscoveryCard(props: DiscoveryCardProps) {
  const [imageError, setImageError] = useState(false);
  return (
    <Anchor href={props.link ?? '/'} style={{ textDecoration: 'none' }}>
      <Stack style={{ maxWidth: 350 }}>
        <div style={{ borderRadius: 8 }}>
          <Image
            style={{ borderRadius: 8 }}
            src={(imageError || !props.image) ? '/images/valist.png' : props.image }
            alt={props.name}
            width={384}
            height={512}
            objectFit="contain"
            objectPosition="center"
            onError={() => setImageError(true)}
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