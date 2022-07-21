import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiscoveryFooter } from './DiscoveryFooter';

export default {
  title: 'DiscoveryFooter',
  component: DiscoveryFooter,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DiscoveryFooter>;

const Template: ComponentStory<typeof DiscoveryFooter> = (args) => (
  <DiscoveryFooter />
);

export const Primary = Template.bind({});