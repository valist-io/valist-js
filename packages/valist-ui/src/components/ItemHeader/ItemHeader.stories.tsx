import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as Icon from 'tabler-icons-react';
import { ItemHeader } from './ItemHeader';

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
  label: 'ACME Co'
};
