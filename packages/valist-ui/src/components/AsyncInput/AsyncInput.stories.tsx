import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AsyncInput } from './AsyncInput';

export default {
  title: 'AsyncInput',
  component: AsyncInput,
} as ComponentMeta<typeof AsyncInput>;

const Template: ComponentStory<typeof AsyncInput> = (args) => (
  <AsyncInput {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  onEnter: (value: string) => console.log(value),
};
