import { Paper } from '@mantine/core';
import Markdown from '../../components/Markdown';

interface ProjectReadmeProps {
  repoReadme: string
}

export default function ProjectReadme(props: ProjectReadmeProps): JSX.Element {
  return (
    <Paper shadow="xs" p="md" radius={"md"} withBorder>
      <Markdown markdown={props.repoReadme} />
    </Paper>
  );
};
