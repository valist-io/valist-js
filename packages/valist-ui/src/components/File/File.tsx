import {
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import useStyles from './File.styles';

export interface FileProps {
  path: string;
  size: number;
}

function formatBytes(bytes: number) {
  const labels = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = Math.ceil(bytes / Math.pow(1024, index));
  return `${size} ${labels[index]}`;
}

export function File(props: FileProps) {
  const { classes } = useStyles();

  return (
    <Group className={classes.card} noWrap>
      <div className={classes.icon}>
        <Icon.File size={20} />
      </div>
      <Stack spacing={0}>
        <Text size="sm" className={classes.path}>
          {props.path}
        </Text>
        <Text size="sm" className={classes.size}>
          {formatBytes(props.size)}
        </Text>
      </Stack>
    </Group>
  );
}