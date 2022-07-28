import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Tabs } from './Tabs';

export default {
  title: 'Tabs',
  component: Tabs,
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <Tabs.Tab label="First"></Tabs.Tab>
    <Tabs.Tab label="Second"></Tabs.Tab>
    <Tabs.Tab label="Third"></Tabs.Tab>
  </Tabs>
);

export const Primary = Template.bind({});

Primary.args = {
  grow: true,
  active: 0,
};

export const Card = Template.bind({});

Card.args = {
  active: 0,
  variant: 'card',
};
