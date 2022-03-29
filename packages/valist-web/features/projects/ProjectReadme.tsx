import Markdown from '../../components/Markdown';

interface ProjectReadmeProps {
  repoReadme: string
}

export default function ProjectReadme(props: ProjectReadmeProps): JSX.Element {
  return (
    <div className="px-8 pt-7 pb-5">
      <Markdown markdown={props.repoReadme} />
    </div>
  );
}
