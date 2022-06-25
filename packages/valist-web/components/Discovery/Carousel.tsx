import { Grid } from "@mantine/core";
import DiscoveryItem from "./DiscoveryItem";

export type Item = {
  img: string,
  name: string,
  description: string,
  type: string,
  link: string,
}

interface CarouselProps {
  items: Item[],
}

export default function Carousel(props: CarouselProps): JSX.Element {
  return (
    <div>
       <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>Popular Software</h2>
        <Grid gutter="sm">
          {props.items.map((item) => (
            <Grid.Col key={item.description} md={6} lg={3}>
              <DiscoveryItem
                img={item.img}
                name={item.name} 
                description={item.description}
                link={item.link}
                type={item.type} 
              />
            </Grid.Col>
          ))}
        </Grid>
    </div>
  );
}