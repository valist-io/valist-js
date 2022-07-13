import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TextInput, TextInputProps } from "./TextInput";

export default {
  title: "TextInput",
  component: TextInput,
} as ComponentMeta<typeof TextInput>

const Template:ComponentStory<typeof TextInput> = (args: TextInputProps) => (
  <TextInput {...args} />
);

export const Primary = Template.bind({})
Primary.args = {
  label: "Test Input"
}