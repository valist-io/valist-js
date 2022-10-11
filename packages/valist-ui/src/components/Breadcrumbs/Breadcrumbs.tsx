import { 
  Breadcrumbs as MantineBreadcrumbs,
  Anchor,
  Text,
} from '@mantine/core'

import React from 'react';
import * as Icon from 'tabler-icons-react';

export interface Breadcrumb {
  title: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: Breadcrumb[];
}

export function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <MantineBreadcrumbs separator={<Icon.ChevronRight color="#9B9BB1" />}>
      <Anchor href="/-/dashboard">
        <Icon.Home color="#9B9BB1" style={{ height: '100%' }} />
      </Anchor>
      {props.items.map((item, index) => 
        <Anchor key={index} href={item.href}>
          <Text color="#9B9BB1" style={{ lineHeight: '31px' }}>{item.title}</Text>
        </Anchor>
      )}
    </MantineBreadcrumbs>
  )
}
