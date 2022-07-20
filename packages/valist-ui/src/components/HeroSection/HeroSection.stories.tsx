import { ComponentStory, ComponentMeta } from '@storybook/react';
import { HeroSection } from './HeroSection';

export default {
  title: 'HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof HeroSection>;

const Template: ComponentStory<typeof HeroSection> = (args) => (
  <HeroSection {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  image: "https://app.valist.io/images/discovery/shattered_realms.png", 
  title: 'Shattered Realms',
  tagline: 'Action, Adventure, RPG',
  link: '/shatteredrealms/game',
};
