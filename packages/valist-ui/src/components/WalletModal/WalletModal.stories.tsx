import { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { WalletModal } from './WalletModal';

export default {
  title: 'WalletModal',
  component: WalletModal,
} as ComponentMeta<typeof WalletModal>;

const Template: ComponentStory<typeof WalletModal> = (args) => {
  const [value, setValue] = useState('');
  return (
    <WalletModal {...args} value={value} onChange={setValue} />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  opened: true,
  accounts: [
    '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    '0x9e56353EF511FB4B85b8afA0cC25FFC26d3EFD5c',
  ]
};
