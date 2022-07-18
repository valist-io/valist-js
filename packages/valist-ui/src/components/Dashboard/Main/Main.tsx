import {
	Grid,
  SimpleGrid,
} from '@mantine/core';

import React from 'react';

export interface MainProps {
  children?: React.ReactNode;
}

export function Main(props: MainProps) {
  return (
    <Grid.Col xl={8}>
      <SimpleGrid 
        spacing={24} 
        breakpoints={[
          { minWidth: 'sm', cols: 1 },
          { minWidth: 'md', cols: 2 },
        ]}
      >
        {props.children}
      </SimpleGrid>
    </Grid.Col>
  );
}