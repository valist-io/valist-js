import React, { Fragment, useEffect, useState } from 'react';
import { useQuery } from "@apollo/client";
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";
import {
    RECENT_LOGS_QUERY,
    USER_LOGS_QUERY, 
    TEAM_LOGS_QUERY,
    PROJECT_LOGS_QUERY, 
} from '../../utils/Apollo/queries';

interface LogCardProps {
  team?: string,
  project?: string,
  address?: string,
  initialLogs?: {id: string, sender?: string}[]
}

export default function LogCard(props: LogCardProps) {
  let query = RECENT_LOGS_QUERY;
  let variables: any = { count: 4 };

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
  const isInitialLogs = (data && data?.logs.length === 0 && props.initialLogs?.length !== 0);

  useEffect(() => {
    if (data && data.logs) {
      setLogs(data.logs);
    }
  }, [data, loading, error]);

  return (
    <section aria-labelledby="announcements-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-base font-medium text-gray-900" id="announcements-title">
            Recent Activity
          </h2>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {(props.initialLogs) && isInitialLogs ? 
               <Fragment >
                {props.initialLogs.map((log) => (
                  <li key={log.id} className="py-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        Connected with {log.sender}
                      </p>
                    </div>
                  </li>
                ))}
              </Fragment>
              :
              <Fragment >
                {logs.map((log) => (
                  <li key={log.id} className="py-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <LogText log={log} />
                      </p>
                      <a href={`https://polygonscan.com//tx/${log.id}`} className="text-sm text-gray-500">
                        view transaction
                      </a>
                    </div>
                  </li>
                ))}
              </Fragment>}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};