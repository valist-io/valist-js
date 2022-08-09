import React from 'react';
import { Tabs } from '@mantine/core';
import { Card } from '../Card';

export interface TabsListCard {
  children?: React.ReactNode;
}

export function TabsListCard(props: TabsListCard) {
  return (
    <Card style={{ paddingTop: 10, paddingBottom: 0, marginBottom: 16 }}>
      <Tabs.List style={{ gap: 40, height: 50 }}>
        {props.children}
      </Tabs.List>
    </Card>
  );
}