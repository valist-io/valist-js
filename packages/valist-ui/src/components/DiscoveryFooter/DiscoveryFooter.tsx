import { Grid, List, useMantineTheme } from "@mantine/core";
import { Logo } from "../Logo";
import { SocialIcons } from "../SocialIcons/SocialIcons";
import useStyles from "./DiscoveryFooter.styles";

export function DiscoveryFooter(): JSX.Element {
  const { classes } = useStyles();

  return (
    <footer className={classes.root}>
      <Grid>
        <Grid.Col lg={3}>
          <List listStyleType="none" spacing="md" size="sm">
            <List.Item><Logo/></List.Item>
            <List.Item>© 2022 Valist, Inc</List.Item>
            <List.Item style={{ marginTop: '24px'}}>All rights reserved</List.Item>
          </List>
        </Grid.Col>
        <Grid.Col sm={6} lg={3}>
          <List listStyleType="none" spacing="md" size="sm">
            <List.Item className={classes.heading}>Resources</List.Item>
            <List.Item><a className={classes.text} href="https://docs.valist.io">Docs</a></List.Item>
          </List>
        </Grid.Col>
        <Grid.Col sm={6} lg={3}>
          <List
            listStyleType="none"
            spacing="md"
            size="sm"
          >
            <List.Item className={classes.heading}>Support</List.Item>
            <List.Item><a className={classes.text} href="mailto:hello@valist.io">Contact Us</a></List.Item>
          </List>
        </Grid.Col>
        <Grid.Col lg={3}>
          <div style={{margin: '6px 0'}}>
            <SocialIcons />
          </div>
        </Grid.Col>
      </Grid>
    </footer>
  );
};