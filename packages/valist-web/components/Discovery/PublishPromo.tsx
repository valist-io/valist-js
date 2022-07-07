import { Button, Grid, Text, Image, useMantineTheme } from "@mantine/core";
import Link from "next/link";

export default function PublishPromo(): JSX.Element {
  const theme = useMantineTheme();
	const bgColor = theme.colorScheme === 'dark' ? 'linear-gradient(0deg, rgba(3, 1, 17, 0.9), rgba(3, 1, 17, 0.9)), url(625497.png)' : '#5850EC';
  const btnColor = theme.colorScheme === 'dark' ? '#5850EC' : 'linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%), #5850EC';
  const publishImage = `/images/discovery/publish_media_${theme.colorScheme === 'dark' ? 'dark' : 'light'}.png`;

  return (
    <Grid style={{ padding: '2rem 2rem 0 2rem', background: bgColor }}>
      <Grid.Col lg={5}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 320 }}>
            <Text style={{ fontSize: 35, color: 'white', fontWeight: 900, margin: 0 }}>Publish today</Text>
            <Text style={{ color: 'white', margin: '10px 0 25px 0' }}>
              Have your software, webapp, or game hosted on valist to be truly decentralized!
            </Text>
            <Link href="/create/release" passHref>
              <Button style={{ background: btnColor }}>Publish Now</Button>
            </Link>
          </div>
        </div>
      </Grid.Col>
      <Grid.Col lg={7}>
        <div style={{ paddingTop: '4rem' }}>
          <Image
            alt={'Featured Project'}
            src={publishImage}
            fit="contain"
          />
        </div>
      </Grid.Col>
    </Grid>
  );
}