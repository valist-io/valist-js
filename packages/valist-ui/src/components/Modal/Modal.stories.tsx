import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Title, Text, Stack } from '@mantine/core';
import { Modal } from './Modal';

export default {
  title: 'Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => (
  <Modal {...args}>
    <Stack style={{ height: 300 }}>
      <Title>Modal title</Title>
      <Text>Modal subtext</Text>
    </Stack>
  </Modal>
);

export const Primary = Template.bind({});

Primary.args = {
  image: '/images/tokens.png',
  opened: true,
  onClose: () => console.log('closed'),
}