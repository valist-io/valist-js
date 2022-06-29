import { generateID } from "@valist/sdk";
import { BigNumberish } from "ethers";
import { Fragment, useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { FileList } from "../../components/Files/FileUpload";
import ValistContext from "../valist/ValistContext";
import Web3Context from "../valist/Web3Context";
import { setAccount, setDescription, setDisplayName, setLimit, setMembers, setName, setPrice, setRoyalty, setRoyaltyAddress, setShortDescription, setWebsite, setYouTubeUrl } from "./projectSlice";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { BasicInfoForm } from "./forms/BasicInfoForm";
import { GraphicsForm } from "./forms/GraphicsForm";
import { DescriptionsForm } from "./forms/DescriptionsForm";
import { MembersForm } from "./forms/MembersForm";
import { PriceForm } from "./forms/PriceForm";
import { useForm,zodResolver } from '@mantine/form';
import { shortnameFilterRegex } from "@/utils/Validation";
import { projectSettingsFormSchema } from "@valist/sdk/dist/formSchema";


interface ProjectFormProps {
  edit: boolean,
  submitText: string,
  accountUsername: string;
  accountID: BigNumberish | null;
  projectID: string;
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


  const projectSettingsForm = useForm({
    schema: zodResolver(projectSettingsFormSchema),
    initialValues: {
        account: props.accountUsername,
        projectName: props.projectName,
        displayName: props.projectDisplayName,
        website: props.projectWebsite,
        shortDescription: props.shortDescription,
        description: props.projectDescription,
        youtube: props.youtubeUrl,
        newMembers: '',
        price: props.price,
        limit: props.limit,
        royalty: props.royalty,
        royaltyAddress: props.royaltyAddress,
    },
  });
 

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

  // Set Values onChange for Redux
  useEffect(() => {
  dispatch(setAccount(projectSettingsForm.values.account));
  }, [ dispatch, projectSettingsForm.values.account]);

  useEffect(() => {
    setCleanName(projectSettingsForm.values.projectName.toLowerCase().replace(shortnameFilterRegex, ''));
  }, [ projectSettingsForm.values.projectName]);

  useEffect(() => {
    dispatch(setDisplayName(projectSettingsForm.values.displayName));
  }, [ dispatch, projectSettingsForm.values.displayName]);

  useEffect(() => {
    dispatch(setWebsite(projectSettingsForm.values.website));
  }, [ dispatch, projectSettingsForm.values.website]);

  useEffect(() => {
    dispatch(setShortDescription(projectSettingsForm.values.shortDescription));
  }, [ dispatch, projectSettingsForm.values.shortDescription]);

  useEffect(() => {
    dispatch(setDescription(projectSettingsForm.values.description));
  }, [ dispatch, projectSettingsForm.values.description]);

  useEffect(() => {
    dispatch(setYouTubeUrl(projectSettingsForm.values.youtube));
  } , [ dispatch, projectSettingsForm.values.youtube]);
  
  useEffect(() => {
    dispatch(setPrice(projectSettingsForm.values.price));
  }, [ dispatch, projectSettingsForm.values.price]);

  useEffect(() => {
    dispatch(setLimit(projectSettingsForm.values.limit));
  }, [ dispatch, projectSettingsForm.values.limit]);
  
  useEffect(() => {
    dispatch(setRoyalty(projectSettingsForm.values.royalty));
  } , [ dispatch, projectSettingsForm.values.royalty]);

  useEffect(() => {
    dispatch(setRoyaltyAddress(projectSettingsForm.values.royaltyAddress));
  } , [ dispatch, projectSettingsForm.values.royaltyAddress]);

  // Handle member list change
  useEffect(() => {
    (async () => {
      const membersList = projectSettingsForm.values.newMembers.split('\n');
      let members: string[] = [];

      for (const member of membersList) {
        let address = await web3Ctx.isValidAddress(member);
        if (address) members.push(address);
      }

      console.log('resolved addresses', members);

      if (members.length > 0) {
        setValidMemberList(true);
        dispatch(setMembers(members));
      } else {
        setValidMemberList(false);
      }

      dispatch(setMembers(members));

      setLoading(false);
    })();
  }, [dispatch, projectSettingsForm.values.newMembers, web3Ctx.isValidAddress]);

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
          mantineValidation={projectSettingsForm}
        />;
      case 'Descriptions':
        return <DescriptionsForm
          shortDescription={props.shortDescription}
          projectDescription={props.projectDescription}
          mantineValidation={projectSettingsForm}
        />;
      case 'Pricing':
        return <PriceForm
          projectID={props.projectID}
          price={props.price}
          limit={props.limit}
          royalty={props.royalty}
          royaltyAddress={props.royaltyAddress}
          mantineValidation={projectSettingsForm}
        />;
      case 'Graphics':
        return <GraphicsForm
          galleryFiles={props.projectGallery}
          youtubeUrl={props.youtubeUrl}
          setGallery={props.setGallery}
          setMainImage={props.setMainImage}
          mantineValidation={projectSettingsForm}
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
          mantineValidation={projectSettingsForm}
          
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


