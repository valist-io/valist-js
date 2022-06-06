import { getBlockExplorer } from '@/utils/Valist';
import { Anchor, Paper } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import getConfig from 'next/config';
import React, { Fragment } from 'react';
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";

interface LogCardProps {
  logs: Log[];
}

export default function LogCard(props: LogCardProps) {
  const colorScheme = useColorScheme();
  const { publicRuntimeConfig } = getConfig();
  
  return (
    <section aria-labelledby="announcements-title">
      <Paper shadow="xs" p="xl" radius="md" withBorder>
          <h2 style={{ fontWeight: 700 }}>
            Recent Activity
          </h2>
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              <Fragment >
                {props?.logs?.slice(0, 4).map((log) => (
                  <li key={log.id} className="py-4">
                    <div className="flex-1 space-y-1">
                      <div className="text-sm">
                        <LogText log={log} />
                      </div>
                      {log.type && 
                        <Anchor color={colorScheme === 'dark' ? 'indigo' : 'black'} href={`${getBlockExplorer(publicRuntimeConfig.CHAIN_ID)}/tx/${log.id.split('-')[0]}`} className="text-sm">
                          view transaction
                        </Anchor>
                      }
                    </div>
                  </li>
                ))}
              </Fragment>
            </ul>
          </div>
      </Paper>
    </section>
  );
};