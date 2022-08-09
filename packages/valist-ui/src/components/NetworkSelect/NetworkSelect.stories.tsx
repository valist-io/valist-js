import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NetworkSelect } from './NetworkSelect';

export default {
  title: 'NetworkSelect',
  component: NetworkSelect,
} as ComponentMeta<typeof NetworkSelect>;

const Template: ComponentStory<typeof NetworkSelect> = (args) => (
  <NetworkSelect {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  value: 137,
};
