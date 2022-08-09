import { ComponentStory, ComponentMeta } from '@storybook/react';
import { NoProjects } from './NoProjects';

export default {
  title: 'NoProjects',
  component: NoProjects,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof NoProjects>;

const Template: ComponentStory<typeof NoProjects> = (args) => (
  <NoProjects action={() => alert('button clicked!')}/>
);

export const Primary = Template.bind({});