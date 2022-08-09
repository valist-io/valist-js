import {
  Divider as MantineDivider,
  useMantineTheme,
} from '@mantine/core';

import React from 'react';

export interface DividerProps {
  style?: React.CSSProperties;
}

export function Divider(props: DividerProps) {
  const theme = useMantineTheme();
  const color = theme.colorScheme === 'dark'
    ? theme.colors.dark[5]
    : theme.colors.gray[1];

  return (
    <MantineDivider color={color} style={props.style} />
  );
}