import {
	Grid,
} from '@mantine/core';

import React from 'react';

export interface MainProps {
  children?: React.ReactNode;
}

export function Main(props: MainProps) {
  return (
    <Grid.Col xl={8}>      
      {props.children}
    </Grid.Col>
  );
}