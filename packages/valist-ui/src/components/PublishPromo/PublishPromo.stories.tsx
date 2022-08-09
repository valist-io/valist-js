import { ComponentStory, ComponentMeta } from '@storybook/react';
import { PublishPromo } from './PublishPromo';

export default {
  title: 'PublishPromo',
  component: PublishPromo,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof PublishPromo>;

const Template: ComponentStory<typeof PublishPromo> = (args) => (
  <PublishPromo />
);

export const Primary = Template.bind({});
