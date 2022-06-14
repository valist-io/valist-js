import { generateID } from "@valist/sdk";
import { BigNumberish } from "ethers";
import { Fragment, useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { FileList } from "../../components/Files/FileUpload";
import ValistContext from "../valist/ValistContext";
import Web3Context from "../valist/Web3Context";
import { setMembers, setName } from "./projectSlice";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { BasicInfoForm } from "./forms/BasicInfoForm";
import { GraphicsForm } from "./forms/GraphicsForm";
import { DescriptionsForm } from "./forms/DescriptionsForm";
import { MembersForm } from "./forms/MembersForm";
import { PriceForm } from "./forms/PriceForm";


interface ProjectFormProps {
  edit: boolean,
  submitText: string,
  accountUsername: string;
  accountID: BigNumberish | null;
  projectName: string;
  projectDisplayName: string;
  price: string;
  limit: string;
  royalty: string;
  royaltyAddress: string;
  shortDescription: string;
  projectDescription: string;
  projectWebsite: string;
  projectMembers: string[];
  projectType: string;
  projectTags: string[];
  projectGallery: FileList[];
  youtubeUrl: string;
  userAccounts: string[];
  view: string;
  setMainImage: UseListStateHandler<FileList>;
  setImage: UseListStateHandler<FileList>;
  setGallery: UseListStateHandler<FileList>;
  addMember: (address: string) => Promise<void>;
  submit: () => void;
}


export default function ProjectForm(props: ProjectFormProps) {
  const web3Ctx = useContext(Web3Context);
  const valistCtx = useContext(ValistContext);
  const dispatch = useAppDispatch();

  const [memberText, setMemberText] = useState<string>('');
  const [_name, _setName] = useState<string>('');
  const [cleanName, setCleanName] = useState<string>('');

  const [validName, setValidName] = useState<boolean>(false);
  const [validMemberList, setValidMemberList] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle submit/confirm
  const handleSubmit = () => {
    if (formValid && !loading) {
      if (!props.edit) {
        alert(`
        Confirmation: You are about to create "${props.projectName}" with the following details:
        
        Account Username: ${props.accountUsername}
        Project name: ${props.projectName}
        Project displayName: ${props.projectDisplayName}
        Members (publishers):
        ${props.projectMembers.join('\n')}
        `);
      };
      props.submit();
    }
  };

  // Handle project name change check onBlur
  useEffect(() => {
    (async () => {
      if (valistCtx && props.accountID && _name) {
        const projectID = generateID(props.accountID, _name);
        const projectExists = await valistCtx.projectExists(projectID);
        setValidName(!projectExists);
      } else {
        setValidName(true);
      }

      dispatch(setName(_name));
    })();
  }, [_name, dispatch, props.accountID, props.accountUsername, valistCtx?.projectExists]);



  // Handle member list change
  useEffect(() => {
    (async () => {
      const membersList = memberText.split('\n');
      let members: string[] = [];

      for (const member of membersList) {
        let address = await web3Ctx.isValidAddress(member);
        if (address) members.push(address);
      }

      if (members.length > 0) {
        setValidMemberList(true);
        dispatch(setMembers(members));
      } else {
        setValidMemberList(false);
      }

      dispatch(setMembers(members));

      setLoading(false);
    })();
  }, [dispatch, memberText, web3Ctx.isValidAddress]);

  // Handle form valid check
  useEffect(() => {
    if (props.edit || (_name && validName)) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [_name, validName, validMemberList, props.edit]);

  const SubmitButton = () => {
    return (
      <span className="w-full inline-flex rounded-md shadow-sm mt-6">
        <button onClick={handleSubmit} value="Submit" type="button"
          className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent
          text-base leading-6 font-medium rounded-md text-white transition ease-in-out duration-150
          ${formValid && !loading ?
              'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
              'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
            }`}>
          {props.submitText}
        </button>
      </span>
    );
  };

  const ProjectFormContent = () => {
    switch (props.view) {
      case 'Basic Info':
        return <BasicInfoForm
          accountNames={props.userAccounts}
          projectTeam={props.accountUsername}
          projectDisplayName={props.projectDisplayName}
          projectWebsite={props.projectWebsite}
          projectType={props.projectType}
          projectTags={props.projectTags}
          edit={props.edit}
          cleanName={cleanName}
          validName={validName}
          setImage={props.setImage}
          setCleanName={setCleanName}
          _setName={_setName}
        />;
      case 'Descriptions':
        return <DescriptionsForm
          shortDescription={props.shortDescription}
          projectDescription={props.projectDescription}
        />;
      case 'Pricing':
        return <PriceForm
          price={props.price}
          limit={props.limit}
          royalty={props.royalty}
          royaltyAddress={props.royaltyAddress}
        />;
      case 'Graphics':
        return <GraphicsForm
          galleryFiles={props.projectGallery}
          youtubeUrl={props.youtubeUrl}
          setGallery={props.setGallery}
          setMainImage={props.setMainImage}
        />;
      case 'Members':
        return <MembersForm
          memberText={memberText}
          validMemberList={validMemberList}
          loading={loading}
          setLoading={setLoading}
          setMemberText={setMemberText}
          addMember={props.addMember}
          edit={props.edit}
        />;
      default:
        return <Fragment />;
    }
  };

  return (
    <div>
      {ProjectFormContent()}
      {(!props.edit || (props.view !== 'Members' && props.edit)) && <SubmitButton />}
    </div>
  );
}




