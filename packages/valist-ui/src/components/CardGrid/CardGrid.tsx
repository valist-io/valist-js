import { SimpleGrid } from '@mantine/core';
import React from 'react';

export interface CardGridProps {
  children?: React.ReactNode;
}

export function CardGrid(props: CardGridProps) {
  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: 'sm', cols: 1, spacing: 24 },
        { minWidth: 'md', cols: 2, spacing: 24 },
      ]}
    >
      {props.children}
    </SimpleGrid>
  );
}