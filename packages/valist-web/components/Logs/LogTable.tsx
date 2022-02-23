import React, { useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";
import { 
    RECENT_LOGS_QUERY, 
    USER_LOGS_QUERY, 
    TEAM_LOGS_QUERY, 
    PROJECT_LOGS_QUERY 
} from '../../utils/Apollo/queries';

interface LogTableProps {
  team?: string,
  project?: string,
  address?: string,
}

export default function LogTable(props: LogTableProps) {
  let query = RECENT_LOGS_QUERY;
  let variables = { count: 100 };

  if (props.project && props.team) {
    query = PROJECT_LOGS_QUERY;
    variables.team = props.team;
    variables.project = props.project;
  } else if (props.team) {
    query = TEAM_LOGS_QUERY;
    variables.team = props.team;
  } else if (props.address) {
    query = USER_LOGS_QUERY;
    variables.address = props.address.toLowerCase();
  }

  const { data, loading, error } = useQuery(query, { variables });
  const [ logs, setLogs ] = useState<Log[]>([]);

  useEffect(() => {
    if (data && data.logs) {
      setLogs(data.logs);
    }
  }, [data, loading, error]);

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
                {logs.map((log, index) => (
                  <tr key={log.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <LogText log={log} />
                    </td>
              
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a href={`https://mumbai.polygonscan.com//tx/${log.id}`} className="text-sm text-gray-500">
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