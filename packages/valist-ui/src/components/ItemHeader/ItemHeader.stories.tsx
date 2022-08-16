import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ItemHeader } from './ItemHeader';
import * as Icon from 'tabler-icons-react';

export default {
  title: 'ItemHeader',
  component: ItemHeader,
} as ComponentMeta<typeof ItemHeader>;

const Template: ComponentStory<typeof ItemHeader> = (args) => (
  <ItemHeader {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  name: 'acme-co',
  label: 'We make everything',
  leftActions: [
    { label: 'Pricing', icon: Icon.Tag, href: '' },
    { label: 'Settings', icon: Icon.Settings, href: '' },
  ],
  rightActions: [
    { label: 'New Release', icon: Icon.News, href: '', variant: 'subtle' },
    { label: 'Purchase', icon: Icon.ShoppingCart, href: '', variant: 'primary' },
  ],
};
