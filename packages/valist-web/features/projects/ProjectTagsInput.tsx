import { useAppDispatch } from "../../app/hooks";
import Tooltip from "../../components/Tooltip";
import { setTags } from "./projectSlice";
import { MultiSelect } from '@mantine/core';
import { tagFilterRegex } from "../../utils/Validation";

const defaultTags = [
 'game', 'protocol', 'application', 'utilities', 'storage', 'networks',
 'social', 'communication', 'nft', 'defi', 'media', 'music',
];

interface ProjectTagsInputProps {
  tags: string[];
}

export default function ProjectTagsInput(props: ProjectTagsInputProps) {
  const dispatch = useAppDispatch();

  const handleChange = (values: string[]) => {
    const tags:string[] = [];

    values.map((value) => {
      value = value.toLowerCase().replace(tagFilterRegex, '');
      tags.push(value);
    });
    dispatch(setTags(tags));
  };

  return (
    <div>
      <h2 className="block text-sm font-medium text-gray-700 mb-2">
        Project Tags <span className="float-right"><Tooltip text="Tags associated with this project." /></span>
      </h2>

      <MultiSelect
        data={defaultTags}
        placeholder="Select tags"
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onChange={(value) => handleChange(value)}
        value={props.tags}
      />
    </div>
  );
}