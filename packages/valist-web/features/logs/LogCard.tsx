import React, { Fragment } from 'react';
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";

interface LogCardProps {
  account?: string;
  project?: string;
  address?: string;
  logs: Log[];
}

export default function LogCard(props: LogCardProps) {
  return (
    <section aria-labelledby="announcements-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-base font-medium text-gray-900" id="announcements-title">
            Recent Activity
          </h2>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              <Fragment >
                {props?.logs?.slice(0, 4).map((log) => (
                  <li key={log.id} className="py-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <LogText log={log} />
                      </p>
                      {log.type && 
                        <a href={`https://polygonscan.com//tx/${log.id}`} className="text-sm text-gray-500">
                          view transaction
                        </a>
                      }
                    </div>
                  </li>
                ))}
              </Fragment>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};