import { Select } from "@mantine/core";
import { Button } from "@valist/ui";

interface SelectRepo {
  repos: string[];
  value: string;
  onChange: (value: any) => any;
  onRepoSelect: (value: any) => any;
}

export function SelectRepo(props: SelectRepo):JSX.Element {
  return (
    <Select
      style={{ marginBottom: 20 }}
      label="Search your repositories" 
      data={props.repos}
      searchable
      onChange={(value) => { 
        if (value) props?.onChange(value);
      }}
      value={props.value}
    />
  );
}