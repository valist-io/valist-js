import FileUpload, { FileList } from "@/components/Files/FileUpload";
import { TextInput, Tooltip as MantineTooltip } from "@mantine/core";
import Tooltip from "@/components/Tooltip";
import { AlertCircle as AlertCircleIcon } from 'tabler-icons-react';
import { SetUseState } from "@/utils/Account/types";
import { UseListStateHandlers } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { useAppDispatch } from "app/hooks";
import { useEffect } from "react";
import { setDescription, setDisplayName, setWebsite } from "../teamSlice";
import SubmitButton from "./SubmitButton";

interface BasicInfoProps {
  edit: boolean;
  form: any;
  validMemberList: boolean;
  accountUsername: string;
  validName: boolean;
  submitText: string;
  setView: SetUseState<string>;
  setValidName: SetUseState<boolean>;
  setImage: UseListStateHandlers<FileList>;
  handleSubmit: () => void;
}

export default function BasicInfoForm(props: BasicInfoProps) {
  const dispatch = useAppDispatch();
  const { form } = props;

  useEffect(() => {
    if (form.values.description) dispatch(setDescription(form.values.description));
  }, [dispatch, form.values.description]);

  useEffect(() => {
    if (form.values.website) dispatch(setWebsite(form.values.website));
  }, [dispatch, form.values.website]);

  useEffect(() => {
    if (form.values.displayName) dispatch(setDisplayName(form.values.displayName));
  }, [dispatch, form.values.displayName]);

  return (
    <form onSubmit={form.onSubmit(props.handleSubmit)} className="grid grid-cols-1 gap-y-6 sm:gap-x-8">
      <FileUpload
        title={'Set Image'}
        setFiles={props.setImage} 
        files={[]} 
        fileView={"none"}
        multiple={false}
      />
      {!props.edit &&
        <TextInput
          required
          label="Username"
          rightSection = {<Tooltip text={"Immutable namespace for your account or team."} />}
          placeholder="Account username"
          radius={'md'}
          {...form.getInputProps('username')}
        />
      }
      <TextInput
        label="Display Name"
        rightSection={<Tooltip text={"Editable dispaly name on the account profile."} />}
        placeholder="Account display name"
        radius={'md'}
        {...form.getInputProps('displayName')}
      />
      <TextInput
        label="Website"
        rightSection = {<Tooltip text={"The link to your account or team's website.."} />}
        placeholder="Website URL"
        radius={'md'}
        {...form.getInputProps('website')}
      />
      <TextInput
        label="Description"
        rightSection = {<Tooltip text={"A short description of the account or team."} />}
        placeholder={'An example description'}
        radius={'md'}
        {...form.getInputProps('description')}
      />

      <SubmitButton 
        handleSubmit={props.handleSubmit}
        formValid={props.edit || (props.validMemberList && props.validName)}
        submitText={(!props.validMemberList && !props.edit) ? 'Continue to Members' : props.submitText}
        navigation={(!props.validMemberList && !props.edit)}
      />
    </form>
  );
};
