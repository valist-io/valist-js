import React, { useState } from 'react';
import { AccountSelect } from './AccountSelect';
import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'AccountSelect',
  component: AccountSelect,
};

type Story = StoryObj<typeof AccountSelect>

const props = {}

export const Primary: Story = {
  args: { ...props },
  render: (args)=>{
    const [value, setValue] = useState('test-1');
    return (
      <AccountSelect {...args} value={value} onChange={setValue}>
        <AccountSelect.Option value="test-1" name="test-1" label="1 project" />
        <AccountSelect.Option value="test-2" name="test-2" label="1 project" />
        <AccountSelect.Option value="test-3" name="test-3" label="1 project" />
        <AccountSelect.Option value="test-4" name="test-4" label="1 project" />
        <AccountSelect.Option value="test-5" name="test-5" label="1 project" />
        <AccountSelect.Option value="test-6" name="test-6" label="1 project" />
        <AccountSelect.Option value="test-7" name="test-7" label="1 project" />
        <AccountSelect.Option value="test-8" name="test-8" label="1 project" />
      </AccountSelect>
    );
  }
}
