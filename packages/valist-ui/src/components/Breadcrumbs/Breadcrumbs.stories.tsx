import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Breadcrumbs, BreadcrumbsProps } from "./Breadcrumbs";
import { Anchor } from '@mantine/core';

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
} as ComponentMeta<typeof Breadcrumbs>

const Template:ComponentStory<typeof Breadcrumbs> = (args: BreadcrumbsProps) => (
  <Breadcrumbs {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
  items: [
    { title: 'acme-co', href: '/' },
    { title: 'go-binary', href: '/' },
  ]
}