import { ProjectType } from "@/utils/github";
import { Button, Group, Select, Textarea } from "@mantine/core";

interface PullRequestProps {
  back: any;
  createPR: any;
  projectType: string;
  setProjectType: any;
  valistConfig: string;
}

export function PullRequest(props: PullRequestProps):JSX.Element {
  return (
    <section>
      <Button color="violet" onClick={(() => props.back())}>Select a different repository</Button>
      <br/>

      <Group style={{ margin: "40px 0" }}>
        <Select 
          label="Project Type"
          data={[{ value: 'next', label: 'NextJS' }, { value: 'go', label: 'Go' }]}
          onChange={(value) => props.setProjectType(value as ProjectType)}
          value={props.projectType}
        />
      </Group>
      <Textarea
        label="Github Action Workflow Preview"
        value={props.valistConfig}
        style={{ width: 750 }}
        disabled
        size="xl"
        minRows={13}
      />
      <br/>
    
      <Button color="violet"onClick={props.createPR}>Create Pull Request</Button>
    </section>
  );
}