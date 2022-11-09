import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <Button {...args}>
    Click me
  </Button>
);

export const Primary = Template.bind({});

Primary.args = {
  variant: 'primary'
};

export const Secondary = Template.bind({});

Secondary.args = {
  variant: 'secondary'
};

export const Subtle = Template.bind({});

Subtle.args = {
  variant: 'subtle'
};

export const Text = Template.bind({});

Text.args = {
  variant: 'text'
};

export const Outline = Template.bind({});

Outline.args = {
  variant: 'outline'
};