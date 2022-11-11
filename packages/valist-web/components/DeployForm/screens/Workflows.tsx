import { Anchor } from "@mantine/core";

interface WorkflowsProps {
  data: any;
  fetchLogs: () => Promise<void>;
}

export function Workflows(props: WorkflowsProps): JSX.Element {
  const showLogs = () => {
    props.fetchLogs();
  };

  return (
    <div>
      {props?.data?.map((workflow: any, index: number) => (
        <div key={index} style={{ margin: '20px 0' }}>
          <div>{workflow.name} - {workflow.id}</div>
          <div>created: {workflow.created_at}</div>
          <div>updated: {workflow.updated_at}</div>
          <Anchor target="_blank" href={workflow.html_url}>Link</Anchor>
        </div>
      ))}
    </div>
  );
}