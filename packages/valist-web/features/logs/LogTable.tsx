import { Paper, Table } from '@mantine/core';
import React from 'react';
import { Log } from '../../utils/Apollo/types';
import LogText from "./LogText";

interface LogTableProps {
  logs: Log[],
}

export default function LogTable(props: LogTableProps) {
  const rows =  props?.logs?.map((log, index) => (
    <tr key={log.id}>
      <td>
        <LogText log={log} />
      </td>

      <td>
        <a href={`https://polygonscan.com//tx/${log.id}`}>
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