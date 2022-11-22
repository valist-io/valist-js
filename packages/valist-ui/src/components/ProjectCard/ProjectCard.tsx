import {
  Card,
  Group,
  Text,
} from '@mantine/core';

import { Item } from '../Item';
import { useStyles } from './ProjectCard.styles';

export interface ProjectCardProps {
  image?: string;
  title?: string;
  secondary?: string;
  description?: string;
}

export function ProjectCard(props: ProjectCardProps): JSX.Element {
  const { classes } = useStyles();
  return (
    <Card className={classes.root}>
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
  );
}
