import { useAppDispatch } from "../../app/hooks";
import { setType } from "./projectSlice";
import { Select } from '@mantine/core';
import Tooltip from "../../components/Tooltip";

const defaultTypes = [
  "web",
  "web-game",
  "installable-game",
  "binary/executable",
];

interface ProjectTypeSelectProps {
  selectedType: string;
}

export default function ProjectTypeSelect(props: ProjectTypeSelectProps) {
  const dispatch = useAppDispatch();

  return (
    <div>
      <Select
        data={defaultTypes}
        placeholder="Select type"
        label="Project Type"
        nothingFound="Nothing found"
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onChange={(value) => dispatch(setType(value || ''))}
        value={props.selectedType}
      />
    </div>
  );
}
