import { ComponentStory, ComponentMeta } from '@storybook/react';
import { CheckboxList } from './CheckboxList';

export default {
  title: 'CheckboxList',
  component: CheckboxList,
} as ComponentMeta<typeof CheckboxList>;

const Template: ComponentStory<typeof CheckboxList> = (args) => (
  <CheckboxList {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  items: [
    { label: 'Connect Wallet', checked: true },
    { label: 'Create Account', checked: true },
    { label: 'Create Project (Optional)', checked: false }
  ]
};