import Image from 'next/image';
import { Card } from '@valist/ui';
import { Anchor, Badge, Title, Text } from '@mantine/core';

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
      <Card style={{ maxWidth: 350 }}>
        <Image 
          src={props.image ?? '/images/valist.png'}
          alt={props.name} 
          width={248}
          height={184}
          objectFit="contain"
        />
        <Title size={18} mt={16} style={{ height: 24 }}>
          {props.name}
        </Title>
        <Text size={12} lineClamp={2} mt={4} style={{ height: 38 }}>
          {props.description}
        </Text>
        <Badge mt={16}>
          {props.type || 'Unknown'}
        </Badge>
      </Card>
    </Anchor>
  );
}