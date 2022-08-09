import {
  Group,
} from '@mantine/core';

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import * as Icon from 'tabler-icons-react';
import { Navbar } from './Navbar';
import { Social } from '../Social';

export default {
  title: 'Navbar',
  component: Navbar,
} as ComponentMeta<typeof Navbar>;

const Template: ComponentStory<typeof Navbar> = (args) => (
  <Navbar {...args}>
    <Navbar.Section grow>
      <Navbar.Link
        icon={Icon.Apps}
        text="Dashboard"
        href="/"
      />
      <Navbar.Link
        icon={Icon.FileText}
        text="Projects"
        href="/"
        active 
      />
      <Navbar.Link
        icon={Icon.Users}
        href="/"
        text="Members" 
      />
      <Navbar.Link 
        icon={Icon.Hourglass}
        href="/"
        text="Activity" 
      />
    </Navbar.Section>
    <Navbar.Section px={30} py="md">
      <Group spacing={30}>
        <Social variant="discord" href="https://valist.io/discord" />
        <Social variant="twitter" href="https://twitter.com/Valist_io" />
        <Social variant="github" href="https://github.com/valist-io" />
      </Group>
    </Navbar.Section>
  </Navbar>
);

export const Primary = Template.bind({});

Primary.args = {
  opened: false,
};
