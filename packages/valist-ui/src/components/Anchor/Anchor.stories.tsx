import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Anchor } from './Anchor';

export default {
  title: 'Anchor',
  component: Anchor,
} as ComponentMeta<typeof Anchor>;

const Template: ComponentStory<typeof Anchor> = (args) => (
  <Anchor {...args}>
    This is a link
  </Anchor>
);

export const Primary = Template.bind({});

Primary.args = {

};
