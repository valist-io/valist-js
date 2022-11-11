import { Button, Select } from "@mantine/core";
import { Octokit } from "@octokit/core";

interface SelectRepo {
  repos: string[];
  value: string;
  onChange: (value: any) => any;
  onRepoSelect: (value: any) => any;
}

export function SelectRepo(props: SelectRepo):JSX.Element {
  return (
    <>
      <Select
        style={{ marginBottom: 20 }}
        label="Select a repository" 
        data={props.repos}
        searchable
        onChange={(value) => { 
          if (value) props.onChange(value);
        }}
        value={props.value}
      />
      <Button 
        color="violet" 
        onClick={props.onRepoSelect}>
          Continue
      </Button>
    </>
  );
}