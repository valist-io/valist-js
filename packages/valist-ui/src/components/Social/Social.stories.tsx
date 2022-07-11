import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Social } from './Social';

export default {
  title: 'Social',
  component: Social,
} as ComponentMeta<typeof Social>;

const Template: ComponentStory<typeof Social> = (args) => (
  <Social {...args}>
  </Social>
);

export const Twitter = Template.bind({});

Twitter.args = {
  variant: 'twitter',
};

export const Discord = Template.bind({});

Discord.args = {
  variant: 'discord',
};

export const Github = Template.bind({});

Github.args = {
  variant: 'github',
};