import { Fragment, useContext, useState } from "react";
import { FileList } from "../../../components/Files/FileUpload";
import { SetUseState } from "../../../utils/Account/types";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import BasicInfoForm from "./BasicInfoForm";
import MembersForm from "./MembersForm";
import { useForm, zodResolver } from '@mantine/form';
import { shortnameRegex } from "@/utils/Validation";
import { z } from 'zod';
import { BigNumber } from "ethers";
import { generateID } from "@valist/sdk";
import getConfig from "next/config";
import ValistContext from "@/features/valist/ValistContext";
import { setMembers, setUsername } from "../teamSlice";
import { useAppDispatch } from "app/hooks";
import Web3Context from "@/features/valist/Web3Context";

interface AccountFormProps {
  initialValues: {
    username: string;
    displayName: string;
    description: string;
    website: string;
  }
  edit: boolean;
  submitText: string;
  view: string;
  accountID: string | null;
  accountUsername: string;
  accountDisplayName: string;
  accountWebsite: string;
  accountMembers: string[];
  accountDescription: string;
  setView: SetUseState<string>;
  setAccountID: SetUseState<string>;
  setImage: UseListStateHandler<FileList>;
  addMember: (address: string) => void;
  submit: () => void;
}

export default function AccountForm(props: AccountFormProps) {
  const valistCtx = useContext(ValistContext);
  const web3Ctx = useContext(Web3Context);
  const [validName, setValidName] = useState<boolean>(false);
  const [validMemberList, setValidMemberList] = useState(false);
  const dispatch = useAppDispatch();
  const { publicRuntimeConfig } = getConfig();

  const handleSubmit = async () => {
    if (props.edit || validName && validMemberList) {
      const username = (accountForm.values.username && !props.edit) ? accountForm.values.username : props.accountUsername;
      let accountID = "";
  
      if (username) {
        const chainID = BigNumber.from(publicRuntimeConfig.CHAIN_ID);
        accountID = generateID(chainID, accountForm.values.username);
      }

      const membersList = accountForm.values.members.split('\n');
      let members: string[] = [];
  
      for (const member of membersList) {
        let address = await web3Ctx.isValidAddress(member);
        if (address) { 
          members.push(address);
        } else {
          accountForm.setFieldError('members', "Member's list contains invalid address");
          setValidMemberList(false);
        }
      }
  
      setValidMemberList(true);
      dispatch(setMembers(members));
  
      if (!props.edit) {
        if (await valistCtx.accountExists(accountID)) {
          accountForm.setFieldError('username', 'Username taken! 😢');
          return;
        }
  
        setValidName(true);
        dispatch(setUsername(accountForm.values.username));
      }

      if (!props.edit) {
        alert(`
Confirmation: You are about to create "${props.accountUsername}" with the following details:
Account username: ${props.accountUsername}
Account display name: ${props.accountDisplayName}
Members (admins):
${props.accountMembers.join('\n')}
`);
      }

      props.submit();
    }
  };

 const accountFormSchema = z.object({
    username: z.string()
      .min(3, { message: 'Username should have at least 3 letters' })
      .max(24, { message: 'Username should not be longer than 24 letters' })
      .regex(shortnameRegex, { message: 'Username can only contain, letters, numbers and dashes' }),
    displayName: z.string(),
    website: z.string(),
    description: z.string(),
    members: z.string(),
    newMember: z.string(),
  });

  const accountForm = useForm({
    schema: zodResolver(accountFormSchema),
    initialValues: {
      username: props.initialValues.username,
      displayName: props.initialValues.displayName,
      website: props.initialValues.website,
      description: props.initialValues.description,
      members: '',
      newMember: '',
    },
  });

  const ProjectFormContent = () => {
    switch (props.view) {
      case 'Basic Info':
        return <BasicInfoForm
          form={accountForm}      
          edit={props.edit}
          accountUsername={props.accountUsername}
          validName={validName}
          validMemberList={validMemberList}
          submitText={props.submitText}
          setImage={props.setImage}
          setValidName={setValidName}
          setView={props.setView}
          handleSubmit={handleSubmit}   
        />;
      case 'Members':
        return <MembersForm
          form={accountForm}
          edit={props.edit}
          accountUsername={props.accountUsername}
          validName={validName}
          validMemberList={validMemberList}
          submitText={props.submitText}
          addMember={props.addMember}
          setValidMemberList={setValidMemberList}
          handleSubmit={handleSubmit}  
        />;
      default:
        return <Fragment />;
    }
  };
  
  return (
    <div>
      {ProjectFormContent()}
    </div>
  );
}
