import { ComponentMeta, ComponentStory } from "@storybook/react";
import { _404 , _404Props } from "./404";

export default {
  title: "404",
  component: _404,
} as ComponentMeta<typeof _404>

const Template:ComponentStory<typeof _404> = (args: _404Props) => (
  <_404 {...args}/>
);

export const Primary = Template.bind({})

Primary.args = {
  message: "Seems a slight error occurred, no biggie click on the button below and we would happily guide you back to safety.",
  action: <button>test</button>,
}