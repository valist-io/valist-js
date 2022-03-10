import { UserIcon } from '@heroicons/react/outline';
import { PlusIcon } from '@heroicons/react/solid';
import Link from 'next/link';

export default function EmptyTeams() {
  return (
    <div className="text-center border-2 border-gray-300 border-dashed rounded-lg p-12">
      <UserIcon className="text-gray-500 h-10 mx-auto" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts or teams</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new personal user account or team.</p>
      <div className="mt-6">
        <Link href="/create?action=team">
          <a
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Account
          </a>
        </Link>
        
      </div>
    </div>
  );
}