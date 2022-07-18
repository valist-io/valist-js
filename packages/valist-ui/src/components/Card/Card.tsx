import { 
  Paper,
} from '@mantine/core';

import useStyles from './Card.styles';

export interface CardProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Card(props: CardProps) {
  const { classes } = useStyles()

  return (
    <Paper className={classes.root} style={props.style}>
      {props.children}
    </Paper>
  );
}
