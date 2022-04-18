import Link from "next/link";

interface TeamProfileActionsProps {
  accountName: string,
}

export default function TeamProfileCardActions(props: TeamProfileActionsProps) {
  return (
    <div className='rounded-lg bg-white overflow-hidden shadow p-4 overflow-visible'>
      <Link href={`/create/${props.accountName}`}>
        <a className="flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700
        bg-white hover:bg-gray-50 mb-1">
          New Project
        </a>
      </Link>

      <Link href={`/edit/account/?name=${props.accountName}`}>
        <a className="flex justify-center items-center px-4 py-2 border
        border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700
        bg-white hover:bg-gray-50">
          Edit
        </a>
      </Link>
    </div>
  );
}