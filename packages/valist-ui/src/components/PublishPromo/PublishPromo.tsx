import { Button, Grid, Text, Image, useMantineTheme } from "@mantine/core";
import Link from "next/link";
import useStyles from "./PublishPromo.styles";

export function PublishPromo(): JSX.Element {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const btnColor = theme.colorScheme === 'dark' ? '#5850EC' : 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%), #5850EC';
  const publishImage = `/images/discovery/publish_media_${theme.colorScheme === 'dark' ? 'dark' : 'light'}.png`;

  return (
    <Grid className={classes.root}>
      <Grid.Col lg={6}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 480 }}>
            <Text className={classes.heading}>Publish today</Text>
            <Text className={classes.text}>
              Have your software, webapp, or game hosted on valist to be truly decentralized!
            </Text>
            <Link href="/create/release" passHref>
              <Button size="lg" style={{ background: btnColor }}>Publish Now</Button>
            </Link>
          </div>
        </div>
      </Grid.Col>
      <Grid.Col lg={6} style={{ paddingBottom: 0 }}>
        <div style={{ paddingTop: '4rem', maxWidth: 735 }}>
          <Image
            alt={'Featured Project'}
            src={publishImage}
            fit="contain"
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};