import React from 'react';
import { useListState } from '@mantine/hooks';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemberList } from './MemberList';

export default {
  title: 'MemberList',
  component: MemberList,
} as ComponentMeta<typeof MemberList>;

const Template: ComponentStory<typeof MemberList> = (args) => {
  const [members, handlers] = useListState([
    '0xD50DaA26f556538562BA308DC0ED45CFaCe885fE',
    '0x89206150520322c1CDDe03Fcb94542eDfA78fC9b',
  ]);

  const onRemove = (member: string) => {
    handlers.filter(other => other !== member)
  }

  return (
    <MemberList
      {...args}
      members={members}
      onRemove={onRemove}
    />
  ); 
};

export const Primary = Template.bind({});

Primary.args = {
  label: 'Project Admin',
  editable: true,
};
