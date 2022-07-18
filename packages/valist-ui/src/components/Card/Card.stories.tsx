import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Title } from '@mantine/core';
import { Card , CardProps } from "./Card";

export default {
  title: "Card",
  component: Card,
} as ComponentMeta<typeof Card>

const Template:ComponentStory<typeof Card> = (args: CardProps) => (
  <Card {...args}>
    <Title>Project Info</Title>
  </Card>
);

export const Primary = Template.bind({})
Primary.args = {

}