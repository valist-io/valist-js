import React from 'react';
import { Paper, Tabs } from '@mantine/core';

export interface TabsListCard {
  children?: React.ReactNode;
}

export function TabsListCard(props: TabsListCard) {
  return (
    <Paper style={{
      width: '100%',
      borderRadius: 8,
      paddingLeft: 32,
      paddingRight: 32,
      paddingTop: 10,
      paddingBottom: 0,
      marginBottom: 16,
    }}>
      <Tabs.List style={{ gap: 40, height: 50 }}>
        {props.children}
      </Tabs.List>
    </Paper>
  );
}