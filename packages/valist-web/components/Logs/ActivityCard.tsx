import React, { useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { USER_LOGS_QUERY } from '../../utils/Apollo/queries';
import { Log } from '../../utils/Apollo/types';

// const logTypeSender = 'sender';
// const logTypeTeam = 'team';
// const logTypeProject = 'project';

interface ActivityCardProps {
  logType: string,
  address: string,
}

export default function ActivityCard(props:ActivityCardProps) {
  const [ logs, setLogs ] = useState<Log[]>([]);
  const { data, loading, error } = useQuery(USER_LOGS_QUERY, {
    variables: { address: props.address.toLowerCase() },
  });

  useEffect(() => {
    if (data && data.logs) {
      setLogs(data.logs);
    }
  }, [data, loading, error]);

  return (
    <section aria-labelledby="announcements-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900" id="announcements-title">
            Recent Activity
          </h2>
          <div className="flow-root mt-4">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {logs.map((log) => (
                <li key={log.id} className="py-5">
                  <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                      {log.team && log.project &&
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {`${log.type} on ${log.team}/${log.project}`}
                        </p>
                      }
                      {log.team && !log.project &&
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {`${log.type} on ${log.team}`}
                        </p>
                      }
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};