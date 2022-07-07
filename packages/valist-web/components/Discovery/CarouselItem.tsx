import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import Link from 'next/link';

interface DiscoveryItemProps {
  img: string,
  name: string,
  description: string,
  link: string,
  type: string,
}

export default function DiscoveryItem(props: DiscoveryItemProps) {
  return (
    <div style={{ width: 340, margin: 'auto' }}>
      <Link href={props.link} passHref>
        <Card shadow="sm" p="lg" sx={() => ({
          '&:hover': {
            border: '2px solid #5850EC',
          },
        })}>
          <Image src={props.img} radius="sm" height={160} alt={props.name} />
          <div>
            <Text style={{ marginTop: 15 }} weight={500}>{props.name}</Text>
            <Text style={{ height: 44 }} size="sm">
              {props.description}
            </Text>
          </div>
          <Badge style={{ marginTop: 15 }} color="gray">{props.type}</Badge>
        </Card>
      </Link>
    </div>
  );
}