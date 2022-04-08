import { useAppDispatch } from "../../app/hooks";
import { setType } from "./projectSlice";
import { Select } from '@mantine/core';
import Tooltip from "../../components/Tooltip";

const defaultTypes = [
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
      <h2 className="block text-sm font-medium text-gray-700 mb-2">
        Project Type <span className="float-right"><Tooltip text="Type associated with this project." /></span>
      </h2>

      <Select
        data={defaultTypes}
        placeholder="Select type"
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
