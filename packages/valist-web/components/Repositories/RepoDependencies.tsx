import { RepoMeta, ReleaseMeta } from '@valist/sdk/dist/types';

interface RepoDependenciesProps {
  orgName: string,
  repoName: string,
  repoMeta: RepoMeta,
  releaseMeta: ReleaseMeta,
}

function GoDependency(dependency: string): JSX.Element {
  return <a target="_blank" rel="noreferrer" href={`https://pkg.go.dev/${dependency}`} key={dependency}>
    {dependency}
  </a>;
}

function NpmDependency(dependency: string): JSX.Element {
  return <div key={dependency}>
    {dependency}
  </div>;
}

function DefaultDependency(dependency: string): JSX.Element {
  return <div key={dependency}>
    {dependency}
  </div>;
}

export default function RepoDependencies(props: RepoDependenciesProps): JSX.Element {
  const { repoMeta, releaseMeta } = props;
  let DependencyItem: (dependency: string) => JSX.Element;

  switch (repoMeta.projectType) {
    case 'go':
      DependencyItem = GoDependency;
      break;
    case 'npm':
      DependencyItem = NpmDependency;
      break;
    default:
      DependencyItem = DefaultDependency;
  }

  return (
    <div className="p-8">
      <h2 className="text-xl">Dependencies</h2>
      <hr />
      <div className="flex flex-wrap mt-2 mb-4">
        {releaseMeta.dependencies && releaseMeta.dependencies.map((dependency: string) => (
          <div className="text-indigo-500 py-4 pr-4" key={dependency}>
            {DependencyItem(dependency)}
          </div>
        ))}
      </div>
    </div>
  );
}
