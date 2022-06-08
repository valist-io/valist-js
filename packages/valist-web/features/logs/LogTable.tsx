import { getBlockExplorer } from '@/utils/Valist';
import { Paper, Table } from '@mantine/core';
import getConfig from 'next/config';
import React from 'react';
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";

interface LogTableProps {
  logs: Log[],
}

export default function LogTable(props: LogTableProps) {
  const { publicRuntimeConfig } = getConfig();
  
  const rows =  props?.logs?.map((log, index) => (
    <tr key={log.id}>
      <td>
        <LogText log={log} />
      </td>

      <td>
        <a href={`${getBlockExplorer(publicRuntimeConfig.CHAIN_ID)}/tx/${log.id.split('-')[0]}`}>
          view transaction
        </a>
      </td>
    </tr>
  ));

  return (
    <Paper shadow="xs" p="0" radius="md" withBorder>
      <Table striped>
        <thead>
          <tr>
            <th>
              Description
            </th>
            <th>
              Transaction
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Paper>
  );
}