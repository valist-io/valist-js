import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Address } from './Address';

export default {
  title: 'Address',
  component: Address,
} as ComponentMeta<typeof Address>;

const Template: ComponentStory<typeof Address> = (args) => (
  <Address {...args}>
  </Address>
);

export const Primary = Template.bind({});

Primary.args = {
  address: '0x89206150520322c1CDDe03Fcb94542eDfA78fC9b',
  truncate: false,
};

export const Truncate = Template.bind({});

Truncate.args = {
  address: '0x89206150520322c1CDDe03Fcb94542eDfA78fC9b',
  truncate: true,
}