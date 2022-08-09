import {
  Grid,
  Stack,
  MediaQuery,
} from '@mantine/core';

import React from 'react';

export interface SideProps {
  children?: React.ReactNode;
}

export function Side(props: SideProps) {
  return (
    <MediaQuery smallerThan="xl" styles={{ display: 'none' }}>
      <Grid.Col span={4}>
        <Stack spacing={24}>
          {props.children}
        </Stack>
      </Grid.Col>
    </MediaQuery>
  );
}