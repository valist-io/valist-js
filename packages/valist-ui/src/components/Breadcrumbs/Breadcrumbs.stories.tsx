import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Breadcrumbs, BreadcrumbsProps } from "./Breadcrumbs";
import { Anchor } from '../Anchor';

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>

const Template:ComponentStory<typeof Breadcrumbs> = (args: BreadcrumbsProps) => (
  <Breadcrumbs {...args}>
    <Anchor>Projects</Anchor>
    <Anchor>Game</Anchor>
  </Breadcrumbs>
)

export const Primary = Template.bind({})
Primary.args = {

}