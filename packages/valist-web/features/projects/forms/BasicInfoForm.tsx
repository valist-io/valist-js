import { Select, TextInput, Tooltip as MantineTooltip } from "@mantine/core";
import { AlertCircle as AlertCircleIcon } from 'tabler-icons-react';
import ProjectTagsInput from "../ProjectTagsInput";
import ProjectTypeSelect from "../ProjectTypeSelect";
import {  setDisplayName, setAccount, setWebsite } from "../projectSlice";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { SetUseState } from "@/utils/Account/types";
import { useAppDispatch } from "../../../app/hooks";
import FileUpload, { FileList } from "../../../components/Files/FileUpload";
import { shortnameFilterRegex } from "@/utils/Validation";

const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

interface BasicInfoProps {
    accountNames: string[];
    projectTeam: string;
    projectDisplayName: string;
    projectWebsite: string;
    projectType: string;
    projectTags: string[];
    edit: boolean;
    cleanName: string;
    validName: boolean;
    setImage: UseListStateHandler<FileList>;
    setCleanName: SetUseState<string>;
    _setName: SetUseState<string>;
  }

export const BasicInfoForm = (props: BasicInfoProps) => {
    const dispatch = useAppDispatch();
    const rightSectionTooltip = (text:string) => {
      return (
        <MantineTooltip label={ text } >
          <AlertCircleIcon size={16} style={{ display: 'block', opacity: 0.5 }} />
       </MantineTooltip>
      );
    };
     
    return (
      <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
        <FileUpload 
          setFiles={props.setImage} 
          title={"Project Profile Image"} 
          files={[]} 
          fileView={"none"}
          multiple={false}
        />
        {!props.edit && <div>
          <Select
           label = "Account or Team"
           data={props.accountNames}
           value={props.projectTeam}
           rightSection = {rightSectionTooltip("The account where this project will be published.")}
           onChange={(value) => dispatch(setAccount(value || ""))}
          >
          </Select>
        </div>}
  
        {!props.edit && <div>
          <TextInput 
          label = "Project Name. Cannot be changed."
          rightSection = {rightSectionTooltip("Immutable namespace for your project.")}
          onChange={(e) => props.setCleanName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
          onBlur={(e) => props._setName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
          value={props.cleanName}
          required
          className={`${props.validName ? normalStyle : !props.cleanName ? normalStyle : errorStyle}`}
          error={!props.validName && "Name Taken!😢"}
          placeholder="Project name"
          /> 
        </div> }
  
        <div>
          <div className="mt-1">
            <TextInput
              label = "Display Name"
              rightSection = {rightSectionTooltip('Editable display name on the project profile.')}
              id="displayName"
              name="displayName"
              type="text"
              onChange={(e) => dispatch(setDisplayName(e.target.value))}
              value={props.projectDisplayName}
              required
              placeholder="Project display name"
            >
            </TextInput>
          </div>
        </div>
        <div>
          <div className="mt-1">
          <TextInput 
            label = "Website"
            rightSection = {rightSectionTooltip("The link to your proejct's website.")}
            type="text"
            onChange={(e) => dispatch(setWebsite(e.target.value))}
            value={props.projectWebsite}
            placeholder='Website URL'
            required
            />
          </div>
  
        </div>
        <ProjectTypeSelect selectedType={props.projectType} />
        <ProjectTagsInput tags={props.projectTags} />
      </form>
    );
  };
  
