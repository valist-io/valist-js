import React from 'react';
import { useListState } from '@mantine/hooks';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemberForm } from './MemberForm';

export default {
  title: 'MemberForm',
  component: MemberForm,
} as ComponentMeta<typeof MemberForm>;

const Template: ComponentStory<typeof MemberForm> = (args) => {
  const [members, handlers] = useListState([
    '0xD50DaA26f556538562BA308DC0ED45CFaCe885fE',
    '0x89206150520322c1CDDe03Fcb94542eDfA78fC9b',
  ]);

  const onRemove = (member: string) => {
    handlers.filter(other => other !== member)
  }

  const onAdd = (member: string) => {
    if (!members.includes(member)) handlers.append(member);
  };

  return (
    <MemberForm 
      members={members}
      onAdd={onAdd}
      onRemove={onRemove}
    />
  ); 
};

export const Primary = Template.bind({});

Primary.args = {

};
