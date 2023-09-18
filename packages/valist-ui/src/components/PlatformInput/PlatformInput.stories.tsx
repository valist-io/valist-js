import { StoryFn } from '@storybook/react';
import { PlatformInput } from './PlatformInput';

export default {
  title: 'PlatformInput',
  component: PlatformInput,
};

const Template: StoryFn<typeof PlatformInput> = (args) => (
  <PlatformInput {...args} />
);

export const Primary = Template.bind({});

Primary.args = {

};
