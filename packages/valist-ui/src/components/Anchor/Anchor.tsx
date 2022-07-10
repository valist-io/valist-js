import { Anchor as MantineAnchor } from '@mantine/core';
import React from 'react';

export interface AnchorProps {
  href?: string;
  children?: React.ReactNode;
}

export function Anchor(props: AnchorProps) {
  return (
    <MantineAnchor href={props.href}>
      {props.children}
    </MantineAnchor>
  );
}