import { 
  Grid, 
} from '@mantine/core';

import React from 'react';
import { Main } from './Main/Main';
import { Side } from './Side/Side';

export interface DashboardProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Dashboard(props: DashboardProps) {
  return (
    <Grid style={props.style}>
      {props.children}
    </Grid>
  );
}

Dashboard.Main = Main;
Dashboard.Side = Side;
