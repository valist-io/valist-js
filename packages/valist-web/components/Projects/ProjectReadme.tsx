import Markdown from '../Markdown';

interface ProjectReadmeProps {
  repoReadme: string
}

export default function ProjectReadme(props: ProjectReadmeProps): JSX.Element {
  const defaultContent = `
# Readme not found
`;

  return (
    <div className="px-8 pt-7 pb-5">
      <Markdown markdown={props.repoReadme || defaultContent} />
    </div>
  );
}
