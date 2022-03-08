import { ClipboardIcon } from "@heroicons/react/outline";
import { useContext } from "react";
import { truncate } from "../../utils/Formatting/truncate";
import { License } from "../../utils/Valist/types";
import AccountContext from "../Accounts/AccountContext";

interface LicenseListProps {
  licenses: License[];
}

export default function LicenseList(props: LicenseListProps) {
  const accountCtx = useContext(AccountContext);

  const handleIDClick = async (id: string) => {
    await navigator.clipboard.writeText(id);
    accountCtx.notify('message', 'Token ID copied to clipboard!');
  };
  
  return (
    <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Team
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Token ID
                </th>
              </tr>
            </thead>
            <tbody>
              {props.licenses?.map((license: License, index) => (
                <tr key={license.name + license.team + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {license.name}
                  </td>
            
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.team}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.project}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {truncate(license.id, 10)}
                    <ClipboardIcon
                      className="h-5 w-5 inline-block -mt-1 cursor-pointer ml-1" 
                      onClick={() => handleIDClick(license.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
};