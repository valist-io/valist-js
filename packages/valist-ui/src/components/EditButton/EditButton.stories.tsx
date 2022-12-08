import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Text } from '@mantine/core';
import { EditButton } from "./EditButton";

export default {
  title: "EditButton",
  component: EditButton,
} as ComponentMeta<typeof EditButton>

const Template:ComponentStory<typeof EditButton> = (args) => (
  <EditButton {...args}>
    <Text>Edit This</Text>
  </EditButton>
);

export const Primary = Template.bind({})

Primary.args = {

}