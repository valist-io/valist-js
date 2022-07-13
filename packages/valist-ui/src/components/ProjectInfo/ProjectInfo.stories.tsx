import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ProjectInfo , ProjectInfoProps } from "./ProjectInfo";

export default {
  title: "ProjectInfo",
  component: ProjectInfo,
} as ComponentMeta<typeof ProjectInfo>

const Template:ComponentStory<typeof ProjectInfo> = (args: ProjectInfoProps) => (
    <ProjectInfo {...args}>
    </ProjectInfo>
);

export const Primary = Template.bind({})
Primary.args = {
  downloads: 4,
  version: "0.0.8",
  publisher: 'Rayzer Fin',
}