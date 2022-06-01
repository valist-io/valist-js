import Tooltip from "@/components/Tooltip";
import Web3Context from "@/features/valist/Web3Context";
import { SetUseState } from "@/utils/Account/types";
import { Button, Textarea, TextInput } from "@mantine/core";
import { useAppDispatch } from "app/hooks";
import { useContext, useState } from "react";
import { setMembers } from "../teamSlice";
import SubmitButton from "./SubmitButton";

export interface UseMembersForm{
  members: string;
}

interface MembersFormProps {
  edit: boolean;
  form: any;
  accountUsername: string;
  validName: boolean;
  validMemberList: boolean;
  submitText: string;
  addMember: (address: string) => void;
  setValidMemberList: SetUseState<boolean>;
  handleSubmit: () => void;
}

export default function MembersForm(props: MembersFormProps) {
  const web3Ctx = useContext(Web3Context);
  const { form, setValidMemberList } = props;

  const handleSubmit = async () => {
    if (props.validName && props.validMemberList && !props.edit) props.handleSubmit();
  };

  const handleAddMember = async () => {
    let address = await web3Ctx.isValidAddress(form.values.newMember);
    if (!address) { 
      form.setFieldError('newMember', "Invalid address or ens name");
      setValidMemberList(false);
    } else {
      props.addMember(address);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="grid grid-cols-1 gap-y-6 sm:gap-x-8">
       {!props.edit &&
        <Textarea
          placeholder={'Member addresses'}
          label="Members"
          radius="md"
          size="md"
          {...form.getInputProps('members')}
        />
      }

      {props.edit &&
        <div>
          <TextInput
            required
            label="New Member"
            placeholder="0x000000"
            {...form.getInputProps('newMember')}
          />
          <Button className="mt-2" style={{ backgroundColor: "#7950f2" }} onClick={() => handleAddMember() } color="violet">
            Add
          </Button>
      </div>}
            
      {!props.edit && <SubmitButton 
        handleSubmit={props.handleSubmit}
        formValid={props.validMemberList} 
        submitText={props.submitText} 
      />}
    </form>
  );
};