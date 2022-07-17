import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Steps } from './Steps';

export default {
  title: 'Steps',
  component: Steps,
} as ComponentMeta<typeof Steps>;

const Template: ComponentStory<typeof Steps> = (args) => (
  <Steps {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  steps: ['Connect Wallet', 'Create Account', 'Create Project (Optional)'],
  orientation: 'vertical',
  active: 0,
};

