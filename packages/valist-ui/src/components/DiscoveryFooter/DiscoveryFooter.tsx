import { Grid, List, useMantineTheme } from "@mantine/core";
import { Logo } from "../Logo";
import { SocialIcons } from "../SocialIcons/SocialIcons";
import useStyles from "./DiscoveryFooter.styles";

export function DiscoveryFooter(): JSX.Element {
  const { classes } = useStyles();
  const theme = useMantineTheme();
	const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';
  const color = theme.colorScheme === 'dark' ? 'white' : 'black';

  return (
    <footer style={{ padding: '80px 40px', backgroundColor }}>
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
            <List.Item style={{ fontSize: 18, fontWeight: 900, margin: '10px 0 25px 0'}}>Resources</List.Item>
            <List.Item><a style={{textDecoration: 'none', color}} href="https://docs.valist.io">Docs</a></List.Item>
          </List>
        </Grid.Col>
        <Grid.Col sm={6} lg={3}>
          <List
            listStyleType="none"
            spacing="md"
            size="sm"
          >
            <List.Item style={{ fontSize: 18, fontWeight: 900, margin: '10px 0 25px 0'}}>Support</List.Item>
            <List.Item><a style={{textDecoration: 'none', color}} href="mailto:hello@valist.io">Contact Us</a></List.Item>
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