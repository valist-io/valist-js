import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Textarea, TextareaProps } from "./Textarea";

export default {
  title: "Textarea",
  component: Textarea,
} as ComponentMeta<typeof Textarea>

const Template:ComponentStory<typeof Textarea> = (args: TextareaProps) => (
  <Textarea {...args} />
);

export const Primary = Template.bind({})
Primary.args = {
  label: "Test Input",
  autosize: true,
}