import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SocialIcons } from './SocialIcons';

export default {
  title: 'SocialIcons',
  component: SocialIcons,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof SocialIcons>;

const Template: ComponentStory<typeof SocialIcons> = (args) => (
  <SocialIcons />
);

export const Primary = Template.bind({});