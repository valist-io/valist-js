import { Card, Image, Text, Badge, Button, Group, useMantineTheme } from '@mantine/core';
import Link from 'next/link';

interface DiscoveryItemProps {
  img: string,
  name: string,
  description: string,
  link: string,
  type: string,
}

export default function CarouselItem(props: DiscoveryItemProps) {
  const theme = useMantineTheme();
  const descColor = theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.dark[4];

  return (
    <div style={{ minWidth: 330, maxWidth: 340, margin: '0 20px 0 0' }}>
      <Link href={props.link} passHref>
        <Card shadow="sm" p="lg" sx={() => ({
          '&:hover': {
            border: '2px solid #5850EC',
          },
        })}>
          <Image src={props.img} radius="md" height={160} alt={props.name} />
          <div>
            <Text style={{ margin: '16px 0 8px 0' }} weight={900}>{props.name}</Text>
            <Text style={{ margin: 0, height: 44, color: descColor }} size="sm">
              {props.description}
            </Text>
          </div>
          <Badge style={{ marginTop: 15 }} color="gray">{props.type}</Badge>
        </Card>
      </Link>
    </div>
  );
}