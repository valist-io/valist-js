import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Stepper } from './Stepper';

export default {
  title: 'Stepper',
  component: Stepper,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => (
  <Stepper {...args}/>
);

export const Primary = Template.bind({});