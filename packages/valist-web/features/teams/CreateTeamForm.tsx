import { useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import ImageUpload from "../../components/Images/ImageUpload";
import Tooltip from "../../components/Tooltip";
import { SetUseState } from "../../utils/Account/types";
import { shortnameFilterRegex } from "../../utils/Validation";
import ValistContext from "../valist/ValistContext";
import Web3Context from "../valist/Web3Context";
import { setBeneficiary, setDescription, setMembers, setName, setWebsite } from "./teamSlice";

interface CreateTeamFormProps {
  edit: boolean,
  submitText: string,
  teamName: string,
  teamWebsite: string,
  teamMembers: string[],
  teamDescription: string,
  teamBeneficiary: string,
  setImage: SetUseState<File | null>,
  submit: () => void
}

export default function CreateTeamForm(props: CreateTeamFormProps) {
  const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
  const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

  const valistCtx = useContext(ValistContext);
  const web3Ctx = useContext(Web3Context);
  const dispatch = useAppDispatch();
  const [memberText, setMemberText] = useState<string>('');

  const [_name, _setName] = useState<string>('');
  const [_beneficiary, _setBeneficiary] = useState<string>('');

  const [cleanName, setCleanName] = useState<string>('');
  const [validName, setValidName] = useState<boolean>(false);
  const [validBeneficiary, setValidBeneficiary] = useState(false);
  const [validMemberList, setValidMemberList] = useState(false);

  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkTeamName = async (teamName: string) => {
      try {
        await valistCtx.contract.getTeamMetaURI(teamName);
      } catch (err: any) {
        if (JSON.stringify(err).includes("err-team-not-exist")) {
          console.log('error', err);
          return false;
        }
      }
      return true;
    };

    (async () => {
      let isNameTaken = _name?.length > 0 && await checkTeamName(_name);
      setValidName(!isNameTaken);
      // props.setName(name);
      dispatch(setName(_name));
    })();
  }, [_name, dispatch, valistCtx.contract]);

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
        // props.setMembers(members);
        dispatch(setMembers(members));
      } else {
        setValidMemberList(false);
      }

      setLoading(false);
    })();
  }, [dispatch, memberText, web3Ctx.isValidAddress]);

  useEffect(() => {
    (async () => {
      const address = await web3Ctx.isValidAddress(_beneficiary) || '';

      if (address) {
        setValidBeneficiary(true);
      } else {
        setValidBeneficiary(false);
      }

      // props.setBeneficiary(beneficary);
      dispatch(setBeneficiary(address));
    })();
  }, [_beneficiary, dispatch, web3Ctx.isValidAddress]);

  useEffect(() => {
    if (props.edit || (_name && validName && validBeneficiary && validMemberList)) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [_name, validName, validBeneficiary, validMemberList]);

  const handleSubmit = () => {
    if (formValid && !loading) {
      if (!props.edit) {
        alert(`
Confirmation: You are about to create "${props.teamName}" with the following details:

Team name/username: ${props.teamName}
Beneficiary address: ${props.teamBeneficiary}
Members (admins):
${props.teamMembers.join('\n')}
`);
      }
      props.submit();
    }
  };
  
  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload text={'Set Image'} setImage={props.setImage} />
      {!props.edit && <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Username <span className="float-right"><Tooltip text='The namespace for your team or account.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            placeholder={'Name'}
            onChange={(e) => setCleanName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            onBlur={(e) => _setName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            value={cleanName}
            required
            className={`${validName ? normalStyle : !cleanName ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
            defaultValue={props.teamName}
          />
        </div>
        {!validName && <div className="text-sm text-red-400">
            <p>Username taken! :c</p>
        </div>}
      </div>}

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website <span className="float-right"><Tooltip text="The link to your team or account's website." /></span>
        </label>
        <div className="mt-1">
          <input
            id="website"
            name="website"
            type="text"
            onBlur={(e) => dispatch(setWebsite(e.target.value))}
            placeholder='Website URL'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
            defaultValue={props.teamWebsite}
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
            onBlur={(e) => dispatch(setDescription(e.target.value))}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder={'An example description'}
            defaultValue={props.teamDescription}
          />
        </div>
      </div>

      {!props.edit && <div>
        <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
          Beneficiary Address<span className="float-right"><Tooltip text='The Polygon address where license or donation funds will be received.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="beneficiary"
            name="beneficiary"
            type="text"
            onBlur={(e) => _setBeneficiary(e.target.value)}
            placeholder='Address'
            required
            className={`${validBeneficiary ? normalStyle : !_beneficiary ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          />
        </div>
      </div>}

      {!props.edit && <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Member Addresses <span className="float-right"><Tooltip text='A list of members seperated by new-line.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="members"
            name="members"
            rows={4}
            onChange={() => { setLoading(true); setMemberText(''); }}
            onBlur={(e) => setMemberText(e.target.value)}
            className={`${validMemberList ? normalStyle : !memberText ? normalStyle : errorStyle} shadow-sm mt-1 block 
            w-full sm:text-sm border rounded-md`}
            placeholder="List of members"
            defaultValue={''}
          />
        </div>
      </div>}
            
      <span className="w-full inline-flex rounded-md shadow-sm">
        <button onClick={() => handleSubmit()} value="Submit" type="button"
          className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent
          text-base leading-6 font-medium rounded-md text-white transition ease-in-out duration-150
          ${formValid && !loading ?
            'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
            'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
          }`}>
            {props.submitText}
        </button>
      </span>
    </form>
  );
}