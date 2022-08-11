import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { InfoButton } from './InfoButton';

export default {
  title: 'InfoButton',
  component: InfoButton,
} as ComponentMeta<typeof InfoButton>;

const Template: ComponentStory<typeof InfoButton> = (args) => (
  <InfoButton {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
};
