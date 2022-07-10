import { Footer as MantineFooter } from '@mantine/core';
import React from 'react';

export interface FooterProps {
  children?: React.ReactNode;
}

export function Footer(props: FooterProps) {
  return (
    <MantineFooter height={60} py="xs" px="md" fixed>
      {props.children}
    </MantineFooter>
  );
}