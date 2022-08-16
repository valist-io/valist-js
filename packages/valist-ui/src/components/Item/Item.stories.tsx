import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as Icon from 'tabler-icons-react';
import { Item } from './Item';

export default {
  title: 'Item',
  component: Item,
} as ComponentMeta<typeof Item>;

const Template: ComponentStory<typeof Item> = (args) => (
  <Item {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  name: 'acme-co',
  large: false,
};
