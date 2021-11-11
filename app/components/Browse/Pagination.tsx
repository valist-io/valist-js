import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from '@heroicons/react/solid';

interface PaginationProps {
  page: number,
  setPage: any,
}

export default function Pagination(props: PaginationProps) {
  const defaultPages = [1, 2, 3, 4, 5];
  const ifSelected = (page: number) => {
    if (page === props.page) {
      return 'border-indigo-500 text-indigo-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium';
    }

    return `border-transparent text-gray-500 hover:text-gray-700
    hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium`;
  };

  return (
    <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        <div
        onClick={() => props.setPage(props.page - 1)}
          className="border-t-2 border-transparent pt-4 pr-1 inline-flex
          items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
        >
          <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </div>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {defaultPages.map((number) => (
          <div
          onClick={() => props.setPage(number)}
          key={number}
          className={ifSelected(number)}
        >
          {number}
        </div>
        ))}
        {/* Current: "border-indigo-500 text-indigo-600", Default:
        "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <div
          onClick={() => props.setPage(props.page + 1)}
          className="border-t-2 border-transparent pt-4 pl-1 inline-flex
          items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
        >
          Next
          <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
}
