import { Fragment, useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import ImageUpload from "../../components/Images/ImageUpload";
import Tooltip from "../../components/Tooltip";
import { SetUseState } from "../../utils/Account/types";
import { shortnameFilterRegex } from "../../utils/Validation";
import ValistContext from "../valist/ValistContext";
import Web3Context from "../valist/Web3Context";
import { setDescription, setMembers, setDisplayName, setUsername, setWebsite } from "./teamSlice";

interface CreateTeamFormProps {
  edit: boolean;
  submitText: string;
  view: string;
  accountID: string;
  teamUsername: string;
  teamDisplayName: string;
  teamWebsite: string;
  teamMembers: string[];
  teamDescription: string;
  setImage: SetUseState<File | null>;
  addMember: (address: string) => Promise<void>;
  submit: () => void;
}

const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

export default function CreateTeamForm(props: CreateTeamFormProps) {
  const valistCtx = useContext(ValistContext);
  const web3Ctx = useContext(Web3Context);
  const dispatch = useAppDispatch();
  const [memberText, setMemberText] = useState<string>('');

  const [_name, _setName] = useState<string>('');

  const [cleanName, setCleanName] = useState<string>('');
  const [validName, setValidName] = useState<boolean>(false);
  const [validMemberList, setValidMemberList] = useState(false);

  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (valistCtx && props.accountID){
        const accountExists = await valistCtx.accountExists(props.accountID);
        setValidName(!accountExists);
      } else {
        setValidName(true);
      }
      dispatch(setUsername(_name));
    })();
  }, [_name, dispatch, props.accountID, valistCtx]);

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

      setLoading(false);
    })();
  }, [dispatch, memberText, web3Ctx.isValidAddress]);

  useEffect(() => {
    if (props.edit || (_name && validName && validMemberList)) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [_name, validName, validMemberList]);

  const handleSubmit = () => {
    if (formValid && !loading) {
      if (!props.edit) {
        alert(`
Confirmation: You are about to create "${props.teamUsername}" with the following details:
Account username: ${props.teamUsername}
Account display name: ${props.teamDisplayName}
Members (admins):
${props.teamMembers.join('\n')}
`);
      }
      props.submit();
    }
  };
  
  const ProjectFormContent = () => {
    switch (props.view) {
      case 'Basic Info':
        return <BasicInfoForm
          setImage={props.setImage}
          setCleanName={setCleanName}
          _setName={_setName}
          teamName={props.teamDisplayName}
          edit={props.edit}
          cleanName={cleanName}
          validName={validName}
          teamWebsite={props.teamWebsite} 
          teamDescription={props.teamDescription}
          formValid={formValid}
          submitText={props.submitText} 
          loading={loading} 
          setLoading={setLoading} 
          handleSubmit={handleSubmit}      
        />;
      case 'Members':
        return <MembersForm 
          edit={props.edit}
          submitText={props.submitText} 
          memberText={memberText} 
          validMemberList={validMemberList} 
          formValid={formValid}
          loading={loading}
          setMemberText={setMemberText} 
          setLoading={setLoading} 
          addMember={props.addMember}
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

interface BasicInfoProps {
  teamName: string;
  teamWebsite: string;
  teamDescription: string;
  edit: boolean;
  cleanName: string;
  validName: boolean;
  formValid: boolean;
  submitText: string;
  loading: boolean;
  setImage: SetUseState<File | null>;
  setCleanName: SetUseState<string>;
  setLoading: SetUseState<boolean>;
  _setName: SetUseState<string>;
  handleSubmit: () => void;
}

const BasicInfoForm = (props: BasicInfoProps) => {
  const dispatch = useAppDispatch();

  console.log('isEdit', props.edit);
  
  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload text={'Set Image'} setImage={props.setImage} />
      {!props.edit && <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Username (Cannot be changed) <span className="float-right"><Tooltip text='Immutable namespace for your team or account.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="username"
            name="username"
            type="text"
            placeholder={'Account username'}
            onChange={(e) => props.setCleanName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            onBlur={(e) => props._setName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            value={props.cleanName}
            required
            className={`${props.validName ? normalStyle : !props.cleanName ? normalStyle : errorStyle}
            bg-slate-50 appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
          />
        </div>
        {!props.validName && <div className="text-sm text-red-400">
            <p>Username taken! 😢</p>
        </div>}
      </div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Display Name <span className="float-right"><Tooltip text='Editable dispaly name on the account profile.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            placeholder={'Account display name'}
            onChange={(e) => dispatch(setDisplayName(e.target.value))}
            required
            className='bg-slate-50 appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm'
            value={props.teamName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website <span className="float-right"><Tooltip text="The link to your team or account's website." /></span>
        </label>
        <div className="mt-1">
          <input
            id="website"
            name="website"
            type="text"
            value={props.teamWebsite}
            onChange={(e) => dispatch(setWebsite(e.target.value))}
            placeholder='Website URL'
            required
            className="bg-slate-50 appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="float-right"><Tooltip text='A short description about the team or account.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => dispatch(setDescription(e.target.value))}
            value={props.teamDescription}
            rows={4}
            className="bg-slate-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder={'An example description'}
          />
        </div>
      </div>
            
      <SubmitButton 
        handleSubmit={props.handleSubmit} 
        formValid={props.formValid} 
        loading={props.loading} 
        submitText={props.submitText} 
      />
    </form>
  );
};

interface MembersFormProps {
  memberText: string;
  edit: boolean;
  validMemberList: boolean;
  formValid: boolean;
  submitText: string;
  loading: boolean;
  setMemberText: SetUseState<any>;
  setLoading: SetUseState<boolean>;
  addMember: (address: string) => Promise<void>;
  handleSubmit: () => void;
}

const MembersForm = (props: MembersFormProps) => {
  const [member, setMember] = useState('');

  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">

       {!props.edit && <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Member Addresses <span className="float-right"><Tooltip text='A list of members seperated by new-line.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="members"
            name="members"
            rows={4}
            onChange={() => { props.setLoading(true); props.setMemberText(''); }}
            onBlur={(e) => props.setMemberText(e.target.value)}
            className={`${props.validMemberList ? normalStyle : !props.memberText ? normalStyle : errorStyle} shadow-sm mt-1 block 
            bg-slate-50 w-full sm:text-sm border rounded-md`}
            placeholder="List of members"
            defaultValue={props.memberText}
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
            
      {!props.edit && <SubmitButton 
        handleSubmit={props.handleSubmit} 
        formValid={props.formValid} 
        loading={props.loading} 
        submitText={props.submitText} 
      />}
    </form>
  );
};

interface SubmitButtonProps {
  handleSubmit: () => void;
  formValid: boolean;
  loading: boolean;
  submitText: string;
}

const SubmitButton = (props: SubmitButtonProps) => {
  return (
    <span className="w-full inline-flex rounded-md shadow-sm">
    <button onClick={() => props.handleSubmit()} value="Submit" type="button"
      className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent
      text-base leading-6 font-medium rounded-md text-white transition ease-in-out duration-150
      ${props.formValid && !props.loading ?
        'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
        'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
      }`}>
        {props.submitText}
    </button>
  </span>
  );
};


