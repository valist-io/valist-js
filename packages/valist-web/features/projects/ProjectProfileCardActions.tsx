import Link from "next/link";

interface ProjectProfileActionsProps {
  accountName: string,
  projectName: string,
}

export default function ProjectProfileCardActions(props: ProjectProfileActionsProps) {
  return (
    <div className='rounded-lg bg-white overflow-hidden shadow p-4 overflow-visible'>
      <Link href={`/create/release?account=${props.accountName}&project=${props.projectName}`}>
        <a className="flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700
        bg-white hover:bg-gray-50 mb-1">
          Publish
        </a>
      </Link>

      <Link href={`/edit/project/?account=${props.accountName}&project=${props.projectName}`}>
        <a className="flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700
        bg-white hover:bg-gray-50">
          Edit
        </a>
      </Link>
    </div>
  );
}