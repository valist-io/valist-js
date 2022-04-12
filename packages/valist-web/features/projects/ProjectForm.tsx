import { Fragment, useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import FileUpload from "../../components/Files/FileUpload";
import Tooltip from "../../components/Tooltip";
import { SetUseState } from "../../utils/Account/types";
import { shortnameFilterRegex } from "../../utils/Validation";
import ValistContext from "../valist/ValistContext";
import Web3Context from "../valist/Web3Context";
import { setDescription, setMembers, setDisplayName, setName, setShortDescription, setTeam, setWebsite, setYoutubeUrl } from "./projectSlice";
import ProjectTagsInput from "./ProjectTagsInput";
import ProjectTypeSelect from "./ProjectTypeSelect";

interface CreateProjectFormProps {
  edit: boolean,
  submitText: string,
  accountUsername: string;
  projectName: string;
  projectDisplayName: string;
  shortDescription: string;
  projectDescription: string;
  projectWebsite: string;
  projectMembers: string[];
  projectType: string;
  projectTags: string[];
  projectGallery: File[];
  youtubeUrl: string;
  userAccounts: string[];
  view: string;
  setImage: SetUseState<File[]>;
  setGallery: SetUseState<File[]>;
  addMember: (address: string) => Promise<void>;
  submit: () => void;
}

const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

export default function CreateProjectForm(props: CreateProjectFormProps) {
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
    const checkProjectName = async (projectName: string) => {
      try {
        console.log('check', props.accountUsername, projectName);
        await valistCtx.getProjectMetaURI(props.accountUsername, projectName);
      } catch (err: any) {
        if (JSON.stringify(err).includes("err-proj-not-exist")) {
          return false;
        }
      }
      return true;
    };

    (async () => {
      let isNameTaken = _name?.length > 0 && await checkProjectName(_name);
      setValidName(!isNameTaken);
      dispatch(setName(_name));
    })();
  }, [_name, dispatch, props.accountUsername, valistCtx.getProjectMetaURI]);

  // Handle member list change
  useEffect(() => {
    (async () => {
      const membersList = memberText.split('\n');
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
  }, [dispatch, memberText, web3Ctx.isValidAddress]);

  // Handle form valid check
  useEffect(() => {
    if (props.edit || (_name && validName && validMemberList)) {
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

  interface GraphicFormProps {
    galleryFiles: File[];
    youtubeUrl: string;
    setGallery: SetUseState<File[]>;
  }

  const GraphicsForm = (props: GraphicFormProps) => {
    return (
      <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
        <FileUpload setFiles={props.setGallery} title={"Project Profile Image"} files={[]} />

        {/* <div>
          <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
            Youtube Url <span className="float-right"><Tooltip text='Youtube video.' /></span>
          </label>
          <div className="mt-1">
            <input
              id="youtube"
              name="youtube"
              required
              onChange={(e) => dispatch(setYoutubeUrl(e.target.value))}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
              focus:border-indigo-500 sm:text-sm"
              placeholder="Youtube Url"
            />
          </div>
        </div> */}
      </form>
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
      case 'Graphics':
        return <GraphicsForm   
          galleryFiles={props.projectGallery}
          youtubeUrl={props.youtubeUrl}
          setGallery={props.setGallery}   
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
  setImage: SetUseState<File[]>;
  setCleanName: SetUseState<string>;
  _setName: SetUseState<string>;
}

const BasicInfoForm = (props: BasicInfoProps) => {
  const dispatch = useAppDispatch();

  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <FileUpload setFiles={props.setImage} title={"Project Profile Image"} files={[]} />
      {!props.edit && <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium text-gray-700">
          Account or Team <span className="float-right"><Tooltip text='The team where this project will be published.' /></span>
        </label>
        <select onChange={(e) => dispatch(setTeam(e.target.value))}
        id="projectAccount" className="mt-1 form-select block w-full pl-3 pr-10 py-2
        text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 sm:text-sm sm:leading-5">
          {props.accountNames?.map((accountName) => (
            <option key={accountName} value={accountName} selected={accountName == props.projectTeam}>{accountName}</option>
          ))}
        </select>
      </div>}

      {!props.edit && <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name (Cannot be changed)<span className="float-right"><Tooltip text='Immutable namespace for your project.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            onChange={(e) => props.setCleanName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            onBlur={(e) => props._setName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            value={props.cleanName}
            required
            className={`${props.validName ? normalStyle : !props.cleanName ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
            placeholder="Project name"
          />
        </div>
        {!props.validName && <div className="text-sm text-red-400">
          <p>Name taken! 😢</p>
        </div>}
      </div> }

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Display Name <span className="float-right"><Tooltip text='Editable dispaly name on the project profile.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="displayName"
            name="displayName"
            type="text"
            onChange={(e) => dispatch(setDisplayName(e.target.value))}
            value={props.projectDisplayName}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
            placeholder="Project display name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website <span className="float-right"><Tooltip text="The link to your proejct's website." /></span>
        </label>
        <div className="mt-1">
          <input
            id="website"
            name="website"
            type="text"
            onChange={(e) => dispatch(setWebsite(e.target.value))}
            value={props.projectWebsite}
            placeholder='Website URL'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <ProjectTypeSelect selectedType={props.projectType} />

      <ProjectTagsInput tags={props.projectTags} />
    </form>
  );
};

interface DescriptionsFormProps {
  shortDescription: string;
  projectDescription: string;
}

const DescriptionsForm = (props: DescriptionsFormProps) => {
  const dispatch = useAppDispatch();

  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Short description <span className="float-right"><Tooltip text="A short description shown on searchs and previews of your project." /></span>
        </label>
        <div className="mt-1">
          <input
            id="shortDescription"
            name="shortDescription"
            type="text"
            onChange={(e) => dispatch(setShortDescription(e.target.value))}
            value={props.shortDescription}
            placeholder='A short description'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="float-right"><Tooltip text='Plain text or markdown describing your project in detail.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => dispatch(setDescription(e.target.value))}
            value={props.projectDescription}
            rows={8}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="An extended description"
          />
        </div>
      </div>
    </form>
  );
};

interface MemebersFormProps {
  memberText: string;
  validMemberList: boolean;
  loading: boolean;
  edit: boolean;
  setLoading: SetUseState<boolean>;
  setMemberText: SetUseState<string>;
  addMember: (address: string) => Promise<void>;
}

const MembersForm = (props: MemebersFormProps) => {
  const [member, setMember] = useState('');
  
  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
       {!props.edit && <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Members <span className="float-right"><Tooltip text='A list of project members seperated by new-line.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="members"
            name="members"
            rows={6}
            value={props.memberText}
            onChange={(e) => { props.setLoading(true); props.setMemberText(e.target.value); }}
            onBlur={(e) => props.setMemberText(e.target.value)}
            className={`${props.validMemberList ? normalStyle : !props.memberText ? normalStyle : errorStyle} shadow-sm mt-1 block 
            w-full sm:text-sm border rounded-md`}
            placeholder="List of members"
          />
        </div>
      </div>}

      {props.edit &&  <div>
        <label htmlFor="new-member" className="block text-sm font-medium text-gray-700">
          New Member <span className="float-right"><Tooltip text="A new member address to be added to the account." /></span>
        </label>
        <div className="mt-1 flex">
          <input
            id="new-member"
            name="new-member"
            type="text"
            onChange={(e) => setMember(e.target.value)}
            placeholder='Member address'
            required
            className="bg-slate-50 appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-l-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
      <button
        type="button"
        onClick={() => props.addMember(member)}
        className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        Add
      </button>
        </div>
      </div>}
    </form>
  );
};