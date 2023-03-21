import { Group, Select, Stack, Text } from "@mantine/core";
import { useState } from "react";

interface SelectRepo {
  repos: string[];
  repo: string;
  onRepoChange: (value: any) => any;
  branch: string;
  onBranchChange: (value: any) => any;
}

export function SelectRepo(props: SelectRepo):JSX.Element {
  const [branchValues, setBranchValues] = useState<string[]>(['main', 'master']);

  return (
    <Stack my='xl'>
      <Text>Search your repositories</Text>
      <Group>
        <Select
          style={{ minWidth: 300 }}
          data={props.repos}
          searchable
          onChange={(value) => { 
            if (value) props?.onRepoChange(value);
          }}
          value={props.repo}
        />
        <Select
          data={branchValues}
          searchable
          creatable
          getCreateLabel={(query) => `+ Add branch ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setBranchValues((current: any) => [...current, item]);
            return item;
          }}
          onChange={(value) => { 
            if (value) props?.onBranchChange(value);
          }}
          value={props.branch}
        />
      </Group>
    </Stack>
  );
}