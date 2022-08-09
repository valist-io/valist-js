import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ProjectCard , ProjectCardProps } from "./ProjectCard";

export default {
  title: "ProjectCard",
  component: ProjectCard,
} as ComponentMeta<typeof ProjectCard>

const Template:ComponentStory<typeof ProjectCard> = (args: ProjectCardProps) => (
  <ProjectCard {...args}>
  </ProjectCard>
);

export const Primary = Template.bind({});

Primary.args = {
  title: 'Unity3D Game',
  secondary: 'Web3 Gamers',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};
