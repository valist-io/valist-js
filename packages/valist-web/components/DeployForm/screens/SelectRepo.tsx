import { Group, Select, Stack, Text } from "@mantine/core";

interface SelectRepo {
  repos: string[];
  repo: string;
  onRepoChange: (value: any) => any;
  branch: string;
  onBranchChange: (value: any) => any;
}

export function SelectRepo(props: SelectRepo):JSX.Element {
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
          data={['main', 'master']}
          onChange={(value) => { 
            if (value) props?.onBranchChange(value);
          }}
          value={props.branch}
        />
      </Group>
    </Stack>
  );
}