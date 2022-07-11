import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AddressInput } from './AddressInput';

export default {
  title: 'AddressInput',
  component: AddressInput,
} as ComponentMeta<typeof AddressInput>;

const Template: ComponentStory<typeof AddressInput> = (args) => (
  <AddressInput {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  onEnter: (value: string) => console.log(value),
};
