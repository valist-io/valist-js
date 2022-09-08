import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Actions } from './Actions';
import * as Icon from 'tabler-icons-react';

export default {
  title: 'Actions',
  component: Actions,
} as ComponentMeta<typeof Actions>;

const Template: ComponentStory<typeof Actions> = (args) => (
  <Actions {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  actions: [
    { label: 'Pricing', icon: Icon.Tag, href: '', side: 'left' },
    { label: 'Settings', icon: Icon.Settings, href: '', side: 'left' },
    { label: 'New Release', icon: Icon.News, href: '', variant: 'subtle', side: 'right' },
    { label: 'Purchase', icon: Icon.ShoppingCart, href: '', variant: 'primary', side: 'right' },
  ],
};
