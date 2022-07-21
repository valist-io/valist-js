import { useState } from "react";
import { ChevronLeft, ChevronRight } from "tabler-icons-react";
import { CarouselItem } from "./CarouselItem";
import useStyles from './Carousel.styles';

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

export function spliceCircular<T>(array: T[], offset: number, length: number = 4): T[] {
  const start = offset;
  const end = start + length;
  const n = array.length;

  const carouselItems = [];
  for (let i = start; i < end; i++) {
    carouselItems.push(array[(i % n + n) % n]);
  }
  return carouselItems;
}

export function Carousel(props: CarouselProps): JSX.Element {
  const { classes } = useStyles();
  const [offset, setOffset] = useState(0);
  const carouselItems = spliceCircular(props.items, offset, props.number);

  const goLeft = () => setOffset(offset + 1);
  const goRight = () => setOffset(offset - 1);

  return (
    <div style={{ marginBottom: 25 }}>
      <div style={{ marginBottom: 20, display: 'flex', position: 'relative' }}>
        <h2 className={classes.title}>{props.title}</h2>
        <div style={{ display: 'flex', position: 'absolute', right: 20 }}>
          <ChevronLeft style={{marginRight: 20, fontSize: 35}} onClick={goLeft}/>
          <ChevronRight onClick={goRight}/>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'scroll' }}>
        {carouselItems.map((item: Item, index ) => (
          <CarouselItem
            key={index}
            img={item.img}
            name={item.name}
            description={item.description}
            link={item.link}
            type={item.type}
          />
        ))}
      </div>
    </div>
  );
};