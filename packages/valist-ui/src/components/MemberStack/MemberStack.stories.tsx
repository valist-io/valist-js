import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemberStack } from './MemberStack';

export default {
  title: 'MemberStack',
  component: MemberStack,
} as ComponentMeta<typeof MemberStack>;

const Template: ComponentStory<typeof MemberStack> = (args) => (
  <MemberStack {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  members: [
    '0xD50DaA26f556538562BA308DC0ED45CFaCe885fE',
    '0x89206150520322c1CDDe03Fcb94542eDfA78fC9b',
  ]
};
