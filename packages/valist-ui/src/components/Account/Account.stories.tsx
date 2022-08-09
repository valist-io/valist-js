import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as Icon from 'tabler-icons-react';
import { Account } from './Account';

export default {
  title: 'Account',
  component: Account,
} as ComponentMeta<typeof Account>;

const Template: ComponentStory<typeof Account> = (args) => (
  <Account {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  name: 'acme-co',
  large: false,
};
