import { ComponentMeta, ComponentStory } from "@storybook/react";
import { InfoCard , InfoCardProps } from "./InfoCard";

export default {
  title: "InfoCard",
  component: InfoCard,
} as ComponentMeta<typeof InfoCard>

const Template:ComponentStory<typeof InfoCard> = (args: InfoCardProps) => (
  <InfoCard {...args} />
);

export const Primary = Template.bind({})
Primary.args = {
  title: 'Project Info',
  values: [
    {label: 'Downloads', value: '4'},
    {label: 'Version', value: '0.0.8'},
    {label: 'Publisher', value: 'Rayzer Fin'},
  ]
}