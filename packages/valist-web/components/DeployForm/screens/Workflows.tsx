import { Anchor, Card, Group } from "@mantine/core";

export type Workflow = {
  id: number;
  name: string;
  display_title: string;
  html_url: string;
  status: string;
  updated_at: string;
  head_branch: string;
}

interface WorkflowsProps {
  data: Workflow[];
  logs: any[];
  // fetchLogs: (job_id: number) => Promise<void>;
}

export function Workflows(props: WorkflowsProps): JSX.Element {
  // const showLogs = (run_id: number) => {
  //   props.fetchLogs(run_id);
  // };

  return (
    <section>
      {props?.data?.map((workflow: Workflow, index: number) => (
        <Card 
          key={index}
          onClick={() => {}}
          style={{ margin: '20px 0', cursor: 'pointer' }}
        >
          <div>{workflow?.display_title}</div>
          <Group my='lg'>
            {workflow?.name} --
            {workflow?.updated_at} --
            {workflow?.status}--
            {workflow?.head_branch}
            <Anchor target="_blank" href={workflow?.html_url || ''}>Link</Anchor>
          </Group>
        </Card>
      ))}
      {props?.logs && 
        <div>
          <ul>
            {props?.logs?.map((log, index) => (
              <ol key={log}>{index + 1} - {log}</ol>
            ))}
          </ul>
        </div>
      }
    </section>
  );
}