import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as Icon from 'tabler-icons-react';
import { Fab } from './Fab';

export default {
  title: 'Fab',
  component: Fab,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Fab>;

const Template: ComponentStory<typeof Fab> = (args) => (
  <Fab {...args}>
    <Fab.Button label="Pricing">
      <Icon.Coin size={32} />
    </Fab.Button>
    <Fab.Button label="Settings">
      <Icon.Settings size={32} />
    </Fab.Button>
  </Fab>
);

export const Primary = Template.bind({});

Primary.args = {

};
