import { Box, Center, Text, BackgroundImage } from "@mantine/core";
import Link from "next/link";
import { Button } from "../Button/Button";
import useStyles from "./HeroSection.styles";

interface HeroSectionProps {
  image: string,
  title: string,
  tagline: string,
  link: string,
}

export function HeroSection(props: HeroSectionProps): JSX.Element {
  const { classes } = useStyles();

  return (
    <Box sx={{ margin: 0, position: 'relative'}}>
      <BackgroundImage
        src={props.image}
        radius="sm"
        className={classes.cover}
      >
        <div className={classes.bg}>
          <div>
            <Center><Text className={classes.title}>{props.title}</Text></Center>
            <Center><Text className={classes.tagline}>{props.tagline}</Text></Center>
            <Center style={{marginTop: 40}}>
              <Link href={props.link} passHref>
                <Button>
                  View Game
                </Button>
              </Link>
            </Center>
          </div>
        </div>
       </BackgroundImage>
    </Box>
  );
};