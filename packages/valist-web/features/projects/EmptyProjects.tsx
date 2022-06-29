import { PlusIcon } from '@heroicons/react/solid';
import { Grid, Skeleton } from '@mantine/core';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import Link from 'next/link';
import { selectAccount, selectPendingProjectID } from './projectSlice';

interface EmptyProjectListProps {
  accountName: string;
}

export default function EmptyProjectList(props: EmptyProjectListProps) {

  const pendingProjectID = useAppSelector(selectPendingProjectID);
  const pendingProjectAccount = useAppSelector(selectAccount);
  const { accountName } = props;

  const pendingProject = () => {
    return (
      <Grid gutter={'md'}>
        <Grid.Col style={{ marginTop: "1rem" }} xs={12} lg={6}>
          <Skeleton width="100%" height="100%" />
        </Grid.Col>
      </Grid>
    );
  };

  const emptyProjects = () => {
    return (
      <div className="text-center border-2 border-gray-300 border-dashed rounded-lg p-12">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium">No projects</h3>
        <p className="mt-1 text-sm">Create a project to publish your first release.</p>
        <div className="mt-6">
          <Link href={`/create/project/?account=${props.accountName}`}>
            <a
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Project
            </a>
          </Link>
        </div>
      </div>
    );

  };

  if (pendingProjectID !== null && accountName == pendingProjectAccount) {
    return pendingProject();
  } else {
    return emptyProjects();
  }

}