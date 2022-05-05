import React from 'react';
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";

interface LogTableProps {
  logs: Log[],
}

export default function LogTable(props: LogTableProps) {
  console.log('props.logs', props.logs);
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
                    Description
                  </th>
 
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Transaction
                  </th>
                </tr>
              </thead>
              <tbody>
                {props?.logs?.map((log, index) => (
                  <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <LogText log={log} />
                    </td>
              
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href={`https://polygonscan.com/tx/${log.id.split('-')[0]}`} className="text-sm text-gray-500">
                        view transaction
                      </a>
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
}