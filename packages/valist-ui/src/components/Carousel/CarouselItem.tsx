import { 
  Anchor,
  Badge, 
  Card, 
  Text, 
  useMantineTheme,
} from '@mantine/core';

import { Image } from '../Image';

interface DiscoveryItemProps {
  img: string,
  name: string,
  description: string,
  link: string,
  type: string,
}

export function CarouselItem(props: DiscoveryItemProps) {
  const theme = useMantineTheme();
  const descColor = theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.dark[4];
  const badgeColor = theme.colorScheme === 'dark' ? '#54546B' : '#F8F8FD';
  const badgeText = theme.colorScheme === 'dark' ? '#FFFFFF' : '#8B82A7';

  return (
    <div style={{maxWidth: 350}}>
      <Anchor href={props.link}>
        <Card shadow="sm" p="lg" sx={() => ({
          '&:hover': {
            cursor: 'pointer',
          },
        })}>
          <Image src={props.img} radius="md" height={160} alt={props.name} />
          <div>
            <Text style={{ margin: '16px 0 8px 0' }} weight={900}>{props.name}</Text>
            <Text style={{ margin: 0, height: 44, overflow: 'hidden', color: descColor }} size="sm">
              {props.description}
            </Text>
          </div>
          <Badge style={{ marginTop: 15, backgroundColor: badgeColor, color: badgeText}} color="gray">{props.type || 'Unknown'}</Badge>
        </Card>
      </Anchor>
    </div>
  );
}