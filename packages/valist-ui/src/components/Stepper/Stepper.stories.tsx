import { ComponentStory, ComponentMeta, StoryFn } from '@storybook/react';
import { Stepper } from './Stepper';

export default {
  title: 'Stepper',
  component: Stepper,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<typeof Stepper> = (args) => (
  <Stepper {...args}/>
);

export const Primary = Template.bind({});