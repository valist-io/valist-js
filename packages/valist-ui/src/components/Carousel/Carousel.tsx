import { CarouselItem } from "./CarouselItem";
import useStyles from './Carousel.styles';
import { Carousel as MantineCarousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { useMantineTheme } from "@mantine/core";

export type Item = {
  img: string,
  name: string,
  description: string,
  type: string,
  link: string,
}

interface CarouselProps {
  items: Item[],
  title: string,
  number?: number,
}


export function Carousel(props: CarouselProps): JSX.Element {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);

  return (
    <div style={{ marginBottom: 25 }}>
      <div style={{ marginBottom: 20, display: 'flex', position: 'relative' }}>
        <h2 className={classes.title}>{props.title}</h2>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <MantineCarousel
          slideSize="20.333333%"
          slideGap="xl"
          align="start"
          loop
          dragFree
          slidesToScroll={mobile ? 1 : 3}
          breakpoints={[
            { maxWidth: 'xl', slideSize: '20%'},
            { maxWidth: 'lg', slideSize: '30%'},
            { maxWidth: 'md', slideSize: '50%' },
            { maxWidth: 'sm', slideSize: '80%' },
          ]}
        >
          {props.items.map((item: Item, index ) => (
            <MantineCarousel.Slide key={index}>
              <CarouselItem
                key={index}
                img={item.img}
                name={item.name}
                description={item.description}
                link={item.link}
                type={item.type}
              />
            </MantineCarousel.Slide>
          ))}
        </MantineCarousel>
      </div>
    </div>
  );
};