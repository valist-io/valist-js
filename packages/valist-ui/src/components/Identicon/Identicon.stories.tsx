import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Identicon } from './Identicon';

export default {
  title: 'Identicon',
  component: Identicon,
} as ComponentMeta<typeof Identicon>;

const Template: ComponentStory<typeof Identicon> = (args) => (
  <Identicon {...args}>
  </Identicon>
);

export const Primary = Template.bind({});

Primary.args = {
  value: '0x89206150520322c1CDDe03Fcb94542eDfA78fC9b',
};
