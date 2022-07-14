import { 
  Paper,
  Grid, 
  Group, 
  Text,
  Title,
  Stack,
} from '@mantine/core';

import useStyles from './InfoCard.styles';
import { Divider } from '../Divider';

export interface Value {
  label: string;
  value: string;
}

export interface InfoCardProps {
  title: string;
  values: Value[];
}

export function InfoCard(props: InfoCardProps) {
  const { classes } = useStyles()

  return (
    <Paper className={classes.root}>
      <Stack>
        <Title order={5}>{props.title}</Title>
        {props.values.map((value, index) =>
          <>
            <Group position="apart" key={value.value}>
              <Text size="sm" weight={400}>{value.label}</Text>
              <Text size="sm" weight={700}>{value.value}</Text>
            </Group> 
            { index !== props.values.length - 1 &&
              <Divider />
            }
          </>
        )}
      </Stack>
    </Paper>
  );
}
