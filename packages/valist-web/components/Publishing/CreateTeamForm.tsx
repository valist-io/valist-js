import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { shortnameFilterRegex } from "../../utils/Validation";
import AccountContext from "../Accounts/AccountContext";
import ImageUpload from "../Images/ImageUpload";
import ValistContext from "../Valist/ValistContext";
import Tooltip from "./Tooltip";

interface CreateTeamFormProps {
  submitText: string,
  teamName: string,
  teamWebsite: string,
  teamMembers: string[],
  teamDescription: string,
  teamBeneficiary: string,
  setName: SetUseState<string>,
  setImage: SetUseState<File | null>,
  setDescription: SetUseState<string>,
  setWebsite: SetUseState<string>,
  setBeneficiary: SetUseState<string>,
  setMembers: SetUseState<string[]>,
  submit: () => void
}

export default function CreateTeamForm(props: CreateTeamFormProps) {
  const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
  const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);

  const [memberText, setMemberText] = useState<string>('');

  const [name, setName] = useState<string>('');
  const [cleanName, setCleanName] = useState<string>('');
  const [validName, setValidName] = useState<boolean>(false);
  const [beneficiary, setBeneficiary] = useState<string>('');
  const [validBeneficiary, setValidBeneficiary] = useState(false);
  const [validMemberList, setValidMemberList] = useState(false);

  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkTeamName = async (teamName: string) => {
      try {
        await valistCtx.contract.getTeamMetaURI(teamName);
      } catch (err: any) {
        if (err?.data?.message.includes("execution reverted: err-team-not-exist")) {
          return false;
        }
      }
      return true;
    };

    (async () => {
      let isNameTaken = name?.length > 0 && await checkTeamName(name);
      setValidName(!isNameTaken);
      props.setName(name);
    })();
  }, [name, props.setName, valistCtx.contract]);

  useEffect(() => {
    (async () => {
      const membersList = memberText.split('\n');
      let members: string[] = [];

      for (const member of membersList) {
        let address = await accountCtx.resolveAddress(member);
        if (address) members.push(address);
      }

      console.log('resolved addresses', members);
      
      if (members.length > 0) {
        setValidMemberList(true);
        props.setMembers(members);
      } else {
        setValidMemberList(false);
      }

      setLoading(false);
    })();
  }, [memberText, props.setMembers, accountCtx.resolveAddress]);

  useEffect(() => {
    (async () => {
      const beneficary = await accountCtx.resolveAddress(beneficiary) || '';

      if (beneficary) {
        setValidBeneficiary(true);
      } else {
        setValidBeneficiary(false);
      }

      props.setBeneficiary(beneficary);
    })();
  }, [beneficiary, props.setBeneficiary, accountCtx.resolveAddress]);

  useEffect(() => {
    console.log('name', name, 'valid', validName, 'beneficary', validBeneficiary, 'valid members', validMemberList);
    if (name && validName && validBeneficiary && validMemberList) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [name, validName, validBeneficiary, validMemberList]);
  
  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload text={'Set Image'} setImage={props.setImage} />
      <div>
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
            onBlur={(e) => setName(e.target.value.toLowerCase().replace(shortnameFilterRegex, ''))}
            value={cleanName}
            required
            className={`${validName ? normalStyle : !cleanName ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
          />
        </div>
        {!validName && <div className="text-sm text-red-400">
            <p>Username taken! :c</p>
        </div>}
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
            onBlur={(e) => props.setWebsite(e.target.value)}
            placeholder='Website URL'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
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
            onBlur={(e) => props.setDescription(e.target.value)}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder={'An example description'}
            defaultValue={''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
          Beneficiary Address<span className="float-right"><Tooltip text='The Polygon address where license or donation funds will be received.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="beneficiary"
            name="beneficiary"
            type="text"
            onBlur={(e) => setBeneficiary(e.target.value)}
            placeholder='Address'
            required
            className={`${validBeneficiary ? normalStyle : !beneficiary ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          />
        </div>
      </div>

      <div>
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
      </div>

            
        <span className="w-full inline-flex rounded-md shadow-sm">
          <button onClick={() => {
            if (formValid && !loading) {
              alert(`
Confirmation: You are about to create "${props.teamName}" with the following details:

Team name/username: ${props.teamName}
Beneficiary address: ${props.teamBeneficiary}
Members (admins):
${props.teamMembers.join('\n')}
              `);
              props.submit();
            }
          }} value="Submit" type="button"
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