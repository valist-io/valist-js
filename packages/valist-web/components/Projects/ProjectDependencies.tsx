import { ReleaseMeta } from "../../utils/Apollo/types";

interface ProjectDependenciesProps {
  releaseMeta: ReleaseMeta,
}

export default function ProjectDependencies(props: ProjectDependenciesProps): JSX.Element {
  return (
    <div className="p-8">
      <h2 className="text-xl">Dependencies</h2>
      <hr className="border-0 bg-gray-300 h-px" />
      <div className="flex flex-wrap mt-2 mb-4">
        {props.releaseMeta.dependencies && props.releaseMeta.dependencies.map((dependency: string) => (
          <div className="text-indigo-500 py-4 pr-4" key={dependency}>
            <div key={dependency}>
              {dependency}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
