import { Grid, List, Text, useMantineTheme } from "@mantine/core";
import SocialIcons from "../Layouts/SocialIcons";

export default function Footer(): JSX.Element {
  const theme = useMantineTheme();
	const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : '';
  
  return (
    <footer style={{ padding: '80px 40px', backgroundColor }}>
      <Grid>
        <Grid.Col lg={3}>
          <List
            spacing="md"
            size="sm"
          >
            <List.Item style={{ fontSize: 18, fontWeight: 900 }}>© 2022 Valist, Inc</List.Item>
            <List.Item>All rights reserved</List.Item>
          </List>
        </Grid.Col>
        <Grid.Col lg={3}>
          <List
            spacing="md"
            size="sm"
          >
            <List.Item style={{ fontSize: 18, fontWeight: 900 }}>Resources</List.Item>
            <List.Item><a href="https://docs.valist.io">Docs</a></List.Item>
          </List>
        </Grid.Col>
        <Grid.Col lg={3}>
          <List
            spacing="md"
            size="sm"
          >
            <List.Item style={{ fontSize: 18, fontWeight: 900 }}>Support</List.Item>
            <List.Item><a href="mailto:hello@valist.io">Contact Us</a></List.Item>
          </List>
        </Grid.Col>
        <Grid.Col lg={3}>
          <SocialIcons />
        </Grid.Col>
      </Grid>
    </footer>
  );
}