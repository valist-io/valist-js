import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AccountPicker } from './AccountPicker';

export default {
  title: 'AccountPicker',
  component: AccountPicker,
} as ComponentMeta<typeof AccountPicker>;

const Template: ComponentStory<typeof AccountPicker> = (args) => (
  <AccountPicker {...args}>
  </AccountPicker>
);

export const Primary = Template.bind({});

Primary.args = {
  account: 'acme-co',
};
