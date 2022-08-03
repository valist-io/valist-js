import { Grid, Text } from "@mantine/core";
import useStyles from "./404.styles";

export interface _404Props {
  message: string;
  action?: JSX.Element;
}

export function _404(props: _404Props):JSX.Element {
  const { classes } = useStyles();

  return (
    <Grid>
      <Grid.Col md={6}>
        <Text className={classes.title}>Oops!!! 😵‍</Text>
        <Text className={classes.message}>{props.message}</Text>
        {props.action}
      </Grid.Col>
      <Grid.Col md={6}>
        <img className={classes.image} src="/images/404.gif" />
      </Grid.Col>
    </Grid>
  );
};