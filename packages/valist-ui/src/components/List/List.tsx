import {
  Stack,
} from '@mantine/core';

import React from 'react';
import { Divider } from '../Divider';

export interface ListProps {
  spacing: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export function List(props: ListProps) {
  const count = React.Children.count(props.children);

  return (
    <Stack spacing={props.spacing} style={props.style}>
      {React.Children.map(props.children, (child, index) => 
        <>
          { child }
          { index !== count - 1 && <Divider /> }
        </>
      )}
    </Stack>
  );
}

List.defaultProps = {
  spacing: 16,
};