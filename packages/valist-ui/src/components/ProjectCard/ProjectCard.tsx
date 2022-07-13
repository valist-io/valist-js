import { 
  Avatar, 
  Paper,
  Group,
  Stack,
  Text,
  Skeleton,
} from '@mantine/core';

import useStyles from './ProjectCard.styles'

export interface ProjectCardProps {
  image?: string;
  title?: string;
  secondary?: string;
  description?: string;
}

export function ProjectCard(props: ProjectCardProps): JSX.Element {
  const { classes } = useStyles();
  return (
    <Paper className={classes.root}>
      <Group mb={16} noWrap>
        <Avatar size="lg" radius="xl" src={props.image} />
        <Stack spacing={0}> 
          <Text weight={700} size="md">{props.title}</Text>
          <Text color="dimmed">{props.secondary}</Text>
        </Stack>
      </Group>
      <Text lineClamp={2}>{props.description}</Text>
    </Paper>
  )
}
