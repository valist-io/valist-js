import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PlatformInput } from './PlatformInput';

export default {
  title: 'PlatformInput',
  component: PlatformInput,
} as ComponentMeta<typeof PlatformInput>;

const Template: ComponentStory<typeof PlatformInput> = (args) => (
  <PlatformInput {...args} />
);

export const Primary = Template.bind({});

Primary.args = {

};
