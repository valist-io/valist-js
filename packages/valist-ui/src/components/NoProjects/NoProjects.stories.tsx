import { NoProjects } from './NoProjects';

export default {
  title: 'NoProjects',
  component: NoProjects,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = () => (
  <NoProjects action={() => alert('button clicked!')}/>
);

export const Primary = Template.bind({});