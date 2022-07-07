import { Box, Button, Center, Text, Image } from "@mantine/core";
import Link from "next/link";

interface HeroSectionProps {
  image: string,
  title: string,
  tagline: string,
  link: string,
}

export default function HeroSection(props: HeroSectionProps): JSX.Element {
  return (
    <Box sx={{ margin: 0, position: 'relative' }}>
      <Image
        alt={'Featured Project'}
        src={props.image}
        fit="contain"
      />
      <div style={{ 
        position: "absolute", 
        top: 0,
        zIndex: 3, 
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(19, 7, 14, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div>
          <Center><Text style={{ fontSize: "30px", fontWeight: 900, color: 'white' }} size="xl">{props.title}</Text></Center>
          <Center><Text style={{ color: 'white' }}>{props.tagline}</Text></Center>
          <Center>
            <Link href={props.link} passHref>
              <Button style={{ marginTop: 30, background: '#5850EC' }}>
                View Game
              </Button>
            </Link>
          </Center>
        </div>
      </div>
    </Box>
  );
}