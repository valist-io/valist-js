import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AccountModal } from './AccountModal';
import { Button } from '../Button';

export default {
  title: 'AccountModal',
  component: AccountModal,
} as ComponentMeta<typeof AccountModal>;

const Template: ComponentStory<typeof AccountModal> = (args) => (
  <AccountModal {...args}>
    <Button>New Account</Button>
  </AccountModal>
);

export const Primary = Template.bind({});

Primary.args = {
  opened: true,
  onChange: (account: string) => console.log(account),
  accounts: ['acme-co', 'valist'],
};
