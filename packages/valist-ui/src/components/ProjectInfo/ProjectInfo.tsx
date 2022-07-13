import { Card, Grid, Group, Text, Divider } from '@mantine/core';
import useStyles from './ProjectInfo.styles';

export interface ProjectInfoProps {
  downloads: number | string;
  version: number | string;
  publisher: string;
}

export function ProjectInfo(props: ProjectInfoProps) {
  const { classes } = useStyles()

  return (
    <Card
      classNames={classes}
      style={{padding:"32px", borderRadius: "8px"}}
    >
      <Grid style={{ marginBottom: "10px"}}>
        <Grid.Col span={4}>
           <Text weight={700}>Project Info</Text>
        </Grid.Col>
        <Grid.Col span={4}></Grid.Col>
      </Grid>
      <Group position='apart' style={{}}>
        <Text weight={400}>Downloads</Text>
        <Text weight={700}>{props.downloads}</Text>
      </Group>
      <Divider my="sm" />
      <Group position='apart' style={{}}>
        <Text weight={400}>Version</Text>
        <Text weight={700}>{props.version}</Text>
      </Group>
      <Divider my="sm" />
      <Group position='apart' style={{}}>
        <Text weight={400}>Publisher</Text>
        <Text weight={700}>{props.publisher}</Text>
      </Group>
    </Card>
  );
}
