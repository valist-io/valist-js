import FileUpload, { FileList } from "@/components/Files/FileUpload";
import { SetUseState } from "@/utils/Account/types";
import { TextInput } from "@mantine/core";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
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
  setImage: UseListStateHandler<FileList>;
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

  const handleSubmit = async () => {
    (!props.validMemberList && !props.edit) ? props.setView('Members') : props.handleSubmit();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-1 gap-y-6 sm:gap-x-8">
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
          placeholder="Account username"
          radius={'xl'}
          {...form.getInputProps('username')}
        />
      }
      <TextInput
        label="Display Name"
        placeholder="Account display name"
        {...form.getInputProps('displayName')}
      />
      <TextInput
        label="Website"
        placeholder="Website URL"
        {...form.getInputProps('website')}
      />
      <TextInput
        label="Description"
        placeholder={'An example description'}
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