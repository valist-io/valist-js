import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Anchor } from '@mantine/core';
import { Button } from '../Button';
import { Header } from './Header';

export default {
  title: 'Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = (args) => (
  <Header {...args}>
    <Anchor>Docs</Anchor>
    <Anchor>Discover</Anchor>
    <Button>Connect Wallet</Button>
  </Header>
);

export const Primary = Template.bind({});

Primary.args = {
  opened: false,
};
