import { 
  Group,
  Text,
} from '@mantine/core';

import { Item } from '../Item';
import { Card } from '../Card';

export interface ProjectCardProps {
  image?: string;
  title?: string;
  secondary?: string;
  description?: string;
}

export function ProjectCard(props: ProjectCardProps): JSX.Element {
  return (
    <Card style={{ height: 168 }}>
      <Group mb={16} noWrap>
        <Item 
          name={props.title}
          label={props.secondary}
          image={props.image}
        />
      </Group>
      <Text size="sm" lineClamp={2}>
        {props.description}
      </Text>
    </Card>
  )
}
